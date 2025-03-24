import reviewDB from "../../models/review/reviewModel.js";

//tao review
export const createReview = async (req, res) => {
  const{recipeid} = req.params;
  const {username,rating,description}=req.body;

  if(!username || !rating){
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  try {
    const addReview = new reviewDB({
      userId:req.userId,recipeid,username,rating,description
    });

    await addReview.save();
    res.status(200).json({ message: "Đánh giá được tạo thành công", addReview })
    } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error })
  }

}

//tim review
export const getRecipeReview = async (req, res) => {
  const{recipeid} = req.params;
  try {
    const getreview = await reviewDB.find({recipeid:recipeid})
    res.status(200).json(getreview)
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error })
  }
}

//xoa review
export const deleteReview = async (req, res) => {
  const{reviewid} = req.params;
  try {
    const DeleteReview = await reviewDB.findByIdAndDelete({_id: reviewid})
    res.status(200).json( {message: "Đánh giá được xóa thành công", deleteReview})
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error })
  }
}


const reviewAuthController = {
  createReview,
  getRecipeReview,
  deleteReview
};

export default reviewAuthController;


