// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// // Helper function to generate JWT
// const generateToken = (userId) => {
//     return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   };

// const registerUser = async (req, res) => {
//     try {
//         const { email, password, firstName, lastName } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findByEmail(email);
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists '})
//         }

//         // Create a new user
//         const user = await User.create({ email, password, firstName, lastName });

//         // Generate JWT
//         const token = generateToken(user.id);

//         res.status(201).json({ message: 'Login successful', token });
//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }

// // Login a user
// const loginUser = async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       // Find the user by email
//       const user = await User.findByEmail(email);
//       if (!user) {
//         return res.status(400).json({ message: 'Invalid credentials' });
//       }
  
//       // Compare passwords
//       const isMatch = await User.comparePassword(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: 'Invalid credentials' });
//       }
  
//       // Generate JWT
//       const token = generateToken(user.id);
  
//       res.status(200).json({ message: 'Login successful', token });
//     } catch (error) {
//       console.error('Error logging in:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   };

// // Get user profile (protected route)
// const userProfile = async (req, res) => {
//     try {
//         // Fetch the user's profile
//         const user = await User.findById(req.userId).select('-password');
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//           }

//           res.status(200).json({ user });
//     } catch (error) {
//         console.error('Error fetching profile:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // Middleware to authenticate JWT
// const authenticateUser = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
  
//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.userId = decoded.userId;
//       next();
//     } catch (error) {
//       console.error('Invalid token:', error);
//       res.status(401).json({ message: 'Unauthorized' });
//     }
//   };

// module.exports = {
//     authenticateUser,
//     userProfile,
//     registerUser,
//     generateToken,
//     loginUser
// } 










