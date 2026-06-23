import model from "../models/index.js";

// Compute grandTotal from ingreId[] + qty[] arrays — call at order creation
export async function getGrandTotal(ingreId, qty) {
  const ingres = await model.Ingre.findAll({ where: { id: ingreId } });
  const priceMap = Object.fromEntries(ingres.map(i => [i.id, i.unitPrice]));
  return Math.round(
    ingreId.reduce((sum, id, idx) => sum + priceMap[id] * qty[idx], 0)
  );
}

// Deduct grandTotal from student budget on order confirm
// userId and grandTotal extracted from order instance
export async function confirmAndDeductBudget(order) {
  const user = await model.User.findByPk(order.userId);
  if (!user) throw new Error('User not found');
  const newBudget = user.budget - order.grandTotal;
  if (newBudget < 0) throw new Error('Insufficient budget');
  await user.update({ budget: newBudget });
  return newBudget;
}

// Return balance to student (e.g. cancelled order)
export async function addbackBalancetoBudget(userId, balance) {
  const user = await model.User.findByPk(userId);
  if (!user) throw new Error('User not found');
  const restored = user.budget + balance;
  await user.update({ budget: restored });
  return restored;
}

// ------- Admin helpers

// Distribute department yearly budget → weekly per-student allocation
// Partitions: yearly → monthly → weekly, then assigns to each student in that class
// Called every week (e.g. via cron). Remainder goes back to central via addbackToCentral.
export async function distributeBudget(departmentId) {
  const school = await model.School.findByPk(departmentId);
  if (!school) throw new Error('Department not found');

  // Fetch only students (role = 0)
  const students = await model.User.findAll({ where: { role: 0 } });
  if (students.length === 0) throw new Error('No students found');

  // Parition to weekly levels before add it up
  const weeklyTotal = Math.floor(school.budget / 52);             // yearly → weekly pool
  const perStudent  = Math.floor(weeklyTotal / students.length);  // floor to integer
  const remainder   = weeklyTotal - (perStudent * students.length);

  await Promise.all(
    students.map(student => student.update({ budget: student.budget + perStudent }))
  );

  if (remainder > 0) {
    await addbackToCentral(departmentId, remainder);
  }

  return { perStudent, remainder, studentCount: students.length };
}

// Return leftover remainder from distribution back to Treasury (school id = 1)
export async function addbackToCentral(departmentId, remainder) {
  const treasury = await model.School.findOne({ where: { department: 'Treasury' } });
  if (!treasury) throw new Error('Treasury entry not found in school table');
  await treasury.update({ budget: treasury.budget + remainder });
  return treasury.budget + remainder;
}