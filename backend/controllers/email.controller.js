// import EmailInfo from "../model/emailInfoModel";
// import UserModel from "../model/userModel";


// export const emailController = async (req, res) => {
//     const { _id } = req.query;
//     const { emailAppPassword } = req.body;
//     try {
//         if (!_id || !emailAppPassword) {
//             return res.status(400).json({
//                 message: "All fields are required"
//             })
//         }

//         const userInfo = await UserModel.findById(_id);
//         if (!userInfo) {
//             return res.status(400).json({
//                 message: "User not found"
//             })
//         }

//         const savedEmailInfo = await EmailInfo.create({
//             emailAppPassword,
//         })
//         return res.status(200).json({
//             message: "Email APP Password saved"
//         })

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         })
//     }
// }

