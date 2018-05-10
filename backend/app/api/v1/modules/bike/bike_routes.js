// import express from 'express';
// import Bike from '../models/Bike';
// const router = express.Router();

// /* GET bikes listing. */
// router.get('/', (req, res, next) => {
//     Bike
//         .fetchAll()
//         .then((bikes) => {
//             res.json({
//                 code: 200,
//                 status: true,
//                 message: 'Updated successfully!'
//             });
//         })
//         .catch((error) => {
//             res.json({
//                 code: 400,
//                 status: false,
//                 data: error,
//                 message: 'Error occured!'
//             });
//         });
// });

// module.exports = router;