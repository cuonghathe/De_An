import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import "./Create_recipe.scss";

const CreateRecipe = () => {
  const [recipename, setRecipename] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState(['']);
  const [ingredients, setIngredients] = useState([{ name: '', measurement: '', quantity: 1 }]);
  const [cookingTime, setCookingTime] = useState('');
  const [servingSize, setServingSize] = useState(1);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);
  }, []);

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', measurement: '', quantity: 1 }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleRemoveInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

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
      const response = await axios.post('http://localhost:5000/recipe/api/create', formData, {
        headers: {
          "Authorization": ` ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error('Lỗi tạo công thức:', error);
      setError(error.response?.data?.error || 'Lỗi tạo công thức');
    }
  };

  return (
    <div className='create_recipe_body'>
      <section>
        <Container className='form_container'>
          <div className="form_data">
            <div className="form_heading">
              <h1>Tạo công thức</h1>
            </div>

            <form onSubmit={handleSubmit} className='summit_form'>
              <div className="form_input">
                <label htmlFor="recipename">Tên</label>
                <input
                  type="text"
                  name="recipename"
                  id="recipename"
                  placeholder="Tên công thức"
                  value={recipename}
                  onChange={(e) => setRecipename(e.target.value)}
                />
              </div>

              <div className="form_input">
                <label htmlFor="description">Mô tả</label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form_input">
                <label htmlFor="ingredients">Nguyên liệu</label>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-row">
                    <input
                      type="text"
                      placeholder="Nhập nguyên liệu"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      className="mr-2"
                    />
                    <input
                      type="number"
                      placeholder="Số lượng"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      className="mr-2"
                    />
                    <select
                      value={ingredient.measurement}
                      onChange={(e) => handleIngredientChange(index, 'measurement', e.target.value)}
                      className="mr-2"
                    >
                      <option value="">Đơn vị</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="cái">cái</option>
                      <option value="củ">củ</option>
                      <option value="quả">quả</option>
                      <option value="lon">lon</option>
                      <option value="thìa bột canh">thìa bột canh</option>
                      <option value="muỗng">muỗng</option>
                    </select>
                    <Button variant="danger" onClick={() => handleRemoveIngredient(index)}>X</Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddIngredient} className="button">
                  Thêm
                </Button>
              </div>

              <div className="form_input_instructions">
                <label htmlFor="instructions">Hướng dẫn</label>
                {instructions.map((instruction, index) => (
                  <div key={index} className="instruction-row">
                    <input
                      type="text"
                      placeholder="Nhập hướng dẫn"
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                    />
                    <Button variant="danger" onClick={() => handleRemoveInstruction(index)}>X</Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddInstruction} className="button">
                  Thêm
                </Button>
              </div>

              <div className="form_input">
                <label htmlFor="cookingTime">Thời gian nấu</label>
                <input
                  type="text"
                  name="cookingTime"
                  id="cookingTime"
                  placeholder="Thời gian nấu"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                />
              </div>

              <div className="form_input">
                <label htmlFor="servingSize">Suất ăn</label>
                <input
                  type="number"
                  name="servingSize"
                  id="servingSize"
                  placeholder="Số lượng suất ăn"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                />
              </div>

              <div className="form_input">
                <label htmlFor="file">Ảnh công thức</label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={handleFileChange}
                />
              </div>

              {typeof error === 'object' ? <p className="error">{error.message}</p> : <p className="error">{error}</p>}

              <Button type="submit">Tạo công thức</Button>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CreateRecipe;