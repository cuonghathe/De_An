import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import "../Create_recipe/Create_recipe.scss";

const UpdateRecipe = () => {
  const { recipeid } = useParams();
  const [recipename, setRecipename] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [cookingTime, setCookingTime] = useState('');
  const [servingSize, setServingSize] = useState(1);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [token, ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipe/api/singleRecipe/${recipeid}`);

      } catch (error) {
        console.error('Lỗi lấy dữ liệu công thức:', error);
        setError('Không thể tải công thức, vui lòng thử lại!');
      }
    };
  
    fetchRecipe();
  }, [recipeid]);
  

  const handleAddInstruction = () => setInstructions([...instructions, '']);
  const handleInstructionChange = (index, value) => {
    setInstructions((prev) => prev.map((ins, i) => (i === index ? value : ins)));
  };
  const handleRemoveInstruction = (index) => setInstructions(instructions.filter((_, i) => i !== index));

  const handleAddIngredient = () => setIngredients([...ingredients, { name: '', measurement: '', quantity: 1 }]);
  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)));
  };
  const handleRemoveIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));
  
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('recipename', recipename);
    formData.append('description', description);
    formData.append('instructions', JSON.stringify(instructions));
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('cookingTime', cookingTime);
    formData.append('servingSize', servingSize);
    if (file) {
      formData.append('recipeImg', file);
    }

    try {
      const response = await axios.patch(`http://localhost:5000/recipe/api/update/${recipeid}`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error('Lỗi cập nhật công thức:', error);
      setError(error.response?.data?.error || 'Lỗi cập nhật công thức');
    }
  };

  return (
    <div className='create_recipe_body'>
      <section>
        <Container className='form_container'>
          <div className="form_data">
            <div className="form_heading">
              <h1>Cập nhật công thức</h1>
            </div>

            <form onSubmit={handleSubmit} className='summit_form'>
              <div className="form_input">
                <label htmlFor="recipename">Tên</label>
                <input type="text" id="recipename" placeholder="Tên công thức" value={recipename} onChange={(e) => setRecipename(e.target.value)} />
              </div>

              <div className="form_input">
                <label htmlFor="description">Mô tả</label>
                <textarea id="description" placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="form_input">
                <label>Nguyên liệu</label>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-row">
                    <input type="text" placeholder="Nhập nguyên liệu" value={ingredient.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} />
                    <input type="number" placeholder="Số lượng" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} />
                    <Button variant="danger" onClick={() => handleRemoveIngredient(index)}>X</Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddIngredient}>Thêm</Button>
              </div>

              <div className="form_input">
                <label>Hướng dẫn</label>
                {instructions.map((instruction, index) => (
                  <div key={index} className="instruction-row">
                    <input type="text" placeholder="Nhập hướng dẫn" value={instruction} onChange={(e) => handleInstructionChange(index, e.target.value)} />
                    <Button variant="danger" onClick={() => handleRemoveInstruction(index)}>X</Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddInstruction}>Thêm</Button>
              </div>

              <div className="form_input">
                <label>Thời gian nấu</label>
                <input type="text" id="cookingTime" placeholder="Thời gian nấu" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} />
              </div>

              <div className="form_input">
                <label>Suất ăn</label>
                <input type="number" id="servingSize" placeholder="Số lượng suất ăn" value={servingSize} onChange={(e) => setServingSize(e.target.value)} />
              </div>

              <div className="form_input">
                <label>Ảnh công thức</label>
                <input type="file" onChange={handleFileChange} />
              </div>

              {error && <p className="error">{error}</p>}

              <Button type="submit">Cập nhật công thức</Button>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default UpdateRecipe;
