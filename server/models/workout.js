// models/workout.js
const db = require("../models/db");

class Workout {
  static async getAllWorkout() {
    const query = "SELECT * FROM workout;";
    const result = await db.query(query);
    return result.rows;
  }

  static async getWorkoutById(id) {
    const query = "SELECT * FROM workout WHERE id = $1;";
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async createWorkout(workoutData, userid, trainerid) {
    const {
      // trainer_id,
      // user_id,
      name,
      repetitions,
      rest,
      exercise_type,
      difficulty_level,
      description,
      required_equipment,
      tags,
    } = workoutData;
    const user_id =userid;
    const trainer_id= trainerid;

    const query = `
      INSERT INTO workout
        (trainer_id, user_id, name, repetitions, rest, exercise_type, difficulty_level, description, required_equipment, tags)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      trainer_id,
      user_id,
      name,
      repetitions,
      rest,
      exercise_type,
      difficulty_level,
      description,
      required_equipment,
      tags,
    ];
    

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updateWorkout(id, workoutData, userid, trainerid) {
    const {
      // trainer_id,
      // user_id,
      name,
      repetitions,
      rest,
      exercise_type,
      difficulty_level,
      description,
      required_equipment,
      tags,
    } = workoutData;
    const user_id =userid;
    const trainer_id= trainerid;

    const query = `
      UPDATE workout
      SET
        name = $3,
        repetitions = $4,
        rest = $5,
        exercise_type = $6,
        difficulty_level = $7,
        description = $8,
        required_equipment = $9,
        tags = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE
        id = $11 and trainer_id = $1 and user_id = $2
      RETURNING *;
    `;

    const values = [
      trainerid,
      userid,
      name,
      repetitions,
      rest,
      exercise_type,
      difficulty_level,
      description,
      required_equipment,
      tags,
      id,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async deleteWorkout(id) {
    const query = "UPDATE workout SET deleted = true WHERE id = $1 RETURNING *;";
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getWorkoutsForTrainerAndUser(trainerId, userId) {
    const query =
      "SELECT * FROM workout WHERE trainer_id = $1 AND user_id = $2 and deleted=false;";
    const values = [trainerId, userId];
    console.log(values);
    const result = await db.query(query, values);
    return result.rows;
  }

  static async getWorkoutsForUser(userId) {
    const query =
      "SELECT * FROM workout WHERE user_id = $1 and deleted=false ;"; // Assuming there's a column named `plan_id`
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
  }
}

module.exports = Workout;

// // models/workout.js

// const { DataTypes } = require("sequelize");
// const sequelize = require("./sequelize"); // Adjust the path accordingly

// const Workout = sequelize.define("Workout", {
//   trainer_id: { type: DataTypes.INTEGER, allowNull: false },
//   user_id: { type: DataTypes.INTEGER, allowNull: false },
//   name: { type: DataTypes.STRING, allowNull: false },
//   repetitions: { type: DataTypes.INTEGER, allowNull: false },
//   rest: { type: DataTypes.STRING, allowNull: false },
//   exercise_type: { type: DataTypes.STRING, allowNull: false },
//   difficulty_level: { type: DataTypes.INTEGER, allowNull: false },
//   description: { type: DataTypes.STRING },
//   required_equipment: { type: DataTypes.STRING },
//   tags: { type: DataTypes.STRING },
//   created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//   updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//   deleted: { type: DataTypes.BOOLEAN, defaultValue: false },

//     // tableName: 'workout', // Specify the exact table name
// },
// {  tableName: 'workout', // Specify the exact table name
// });

// // Define associations
// Workout.belongsTo(Trainer, { foreignKey: 'trainer_id', as: 'trainer' });
// Workout.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// module.exports = Workout;
