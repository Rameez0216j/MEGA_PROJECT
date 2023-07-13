import Cart from "../models/Cart";

// exports.updateCart= async(req,res)=>{
//     try{
//         const {user,cart} = req.body;

//         const updated_cart=await cart.findByIdAndUpdate(
//             {
//                 user: user,
//             },
//             {
//                 cart:cart
//             },
//             { new: true }
//         );

//         res.status(200).json({
//             success:true,
//             message:"Cart updated Successfully"
//         })
//     }catch(error){
//         console.log("Error occured while updating cart")
//         res.status(500).json({
//             success:false,
//             message:"Cart not updated"
//         })
//     }
// }