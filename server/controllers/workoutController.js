// controllers/workoutController.js
const Workout = require("../models/workout");

class WorkoutController {
  static async getAllWorkouts(req, res) {
    try {
      const workouts = await Workout.getAllWorkout();
      res.json(workouts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getWorkoutById(req, res) {
    const { id } = req.params;

    try {
      const workout = await Workout.getWorkoutById(id);

      if (workout) {
        res.json(workout);
      } else {
        res.status(404).send("Workout not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async createWorkout(req, res) {
    const workoutData = req.body;
    const user_id = req.params.userId;
    const trainer_id = req.user.user.Id;
    try {
      const newWorkout = await Workout.createWorkout(workoutData, user_id, trainer_id);
      res.status(201).json(newWorkout);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async updateWorkout(req, res) {
    const { id } = req.params;
    const workoutData = req.body;
    const user_id = req.params.userId;
    const trainer_id = req.user.user.Id;
    console.log(id, user_id);
    try {
      const updatedWorkout = await Workout.updateWorkout(id, workoutData, user_id, trainer_id);

      if (updatedWorkout) {
        res.json(updatedWorkout);
      } else {
        res.status(404).send("Workout not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async deleteWorkout(req, res) {
    const { id } = req.params;

    try {
      const deletedWorkout = await Workout.deleteWorkout(id);

      if (deletedWorkout) {
        res.json(deletedWorkout);
      } else {
        res.status(404).send("Workout not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getWorkoutsForTrainerAndUser(req, res) {
    // const { trainer_id, user_id } = req.user; // Assuming the token contains user information
    const trainer_id = req.user.user.Id;
    const user_id = req.params.userId;
    try {
      const workouts = await Workout.getWorkoutsForTrainerAndUser(
        trainer_id,
        user_id
      );
      res.json(workouts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getWorkoutsForUser(req, res) {
    const user_id = req.user.user.Id; // Assuming the token contains user information
    console.log(user_id);
    try {
      const workouts = await Workout.getWorkoutsForUser(user_id);
      res.json(workouts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = WorkoutController;

// const Workout = require('../models/workout');

// // Get all workouts
// exports.getAllWorkouts = async (req, res) => {
//   try {
//     const workouts = await Workout.findAll();
//     res.json(workouts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// };

// // Get workout by ID
// exports.getWorkoutById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const workout = await Workout.findByPk(id);

//     if (!workout) {
//       return res.status(404).json({ message: 'Workout not found' });
//     }

//     res.json(workout);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// };

// // Create a new workout
// exports.createWorkout = async (req, res) => {
//   try {
//     const workout = await Workout.create(req.body);
//     res.status(201).json(workout);
//   } catch (err) {
//     console.error(err);

//     if (err.name === 'SequelizeValidationError') {
//       return res.status(400).json({ message: 'Validation Error', errors: err.errors });
//     }

//     res.status(500).send('Internal Server Error');
//   }
// };

// // Update workout by ID
// exports.updateWorkout = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const [updatedRowsCount, updatedWorkouts] = await Workout.update(req.body, { where: { id }, returning: true });

//     if (updatedRowsCount === 0) {
//       return res.status(404).json({ message: 'Workout not found' });
//     }

//     res.json(updatedWorkouts[0]);
//   } catch (err) {
//     console.error(err);

//     if (err.name === 'SequelizeValidationError') {
//       return res.status(400).json({ message: 'Validation Error', errors: err.errors });
//     }

//     res.status(500).send('Internal Server Error');
//   }
// };

// // Delete workout by ID
// exports.deleteWorkout = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedRowCount = await Workout.destroy({ where: { id } });

//     if (deletedRowCount === 0) {
//       return res.status(404).json({ message: 'Workout not found' });
//     }

//     res.json({ message: 'Workout deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// };
