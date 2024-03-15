import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ProductService from '../productService';

const CreateProduct = () => {
    const [fileNames, setFileNames] = useState([]);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const methods = useForm();

    const { register, handleSubmit, setValue, formState: { errors } } = methods;

    const postProduct = ProductService.usePostProduct();

    const handleImageChange = (e) => {
        const selectedFiles = e.target.files;
        if (selectedFiles.length === 0) {
            return;
        }

        const newFileNames = Array.from(selectedFiles).map(file => file.name);
        const updatedFileNames = [...fileNames, ...newFileNames];

        setFileNames(updatedFileNames);

        const newFiles = Array.from(selectedFiles);
        const updatedFiles = [...files, ...newFiles];

        setFiles(updatedFiles);

        const imageFile = selectedFiles[0];
        if (!(imageFile instanceof Blob)) {
            console.error('Not a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setValue('images', updatedFileNames);
            setValue('thumbnail', newFileNames[0]);
        };
        reader.readAsDataURL(imageFile);
    };

    const removeImage = (index) => {
        const updatedFileNames = [...fileNames];
        updatedFileNames.splice(index, 1);
        setFileNames(updatedFileNames);

        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await postProduct.mutateAsync(data);
            console.log('Post Product Response:', response);
            navigate('/', {state: response});
        } catch (error) {
            console.error('Error posting product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='user_box'>
            <h2>Add Product</h2>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='user_form'>
                        <div className='form_group p_relative'>
                            <label>
                                <span className='label_name'>Product Name*</span>
                                <input {...register('title', { required: 'Product Name is required' })} />
                                {errors?.title && <p className="error-message">{errors.title.message}</p>}
                            </label>
                        </div>
                        <div className='form_group p_relative'>
                            <label>
                                <span className='label_name'>Description*</span>
                                <input {...register('description', { required: 'Description is required' })} />
                                {errors?.description && <p className="error-message">{errors.description.message}</p>}
                            </label>
                        </div>

                        <div className='form_group p_relative'>
                            <label>
                                <span className='label_name'>Category*</span>
                                <input {...register('category', { required: 'Category is required' })} />
                                {errors?.category && <p className="error-message">{errors.category.message}</p>}
                            </label>
                        </div>

                        <div className='form_group p_relative'>
                            <label>
                                <span className='label_name'>Stock*</span>
                                <input {...register('stock', { required: 'Stock is required' })} />
                                {errors?.stock && <p className="error-message">{errors.stock.message}</p>}
                            </label>
                        </div>
                        <div className='form_group p_relative'>
                            <label>
                                <span className='label_name'>Price*</span>
                                <input {...register('price', { required: 'Price is required' })} />
                                {errors?.price && <p className="error-message">{errors.price.message}</p>}
                            </label>
                        </div>

                        <div className='form_group p_relative'>
                            <label>
                                <span className='label_name'>Rating</span>
                                <input {...register('rating')} />
                                {/* {errors?.title && <p className="error-message">{errors.title.message}</p>} */}
                            </label>
                        </div>

                        <div className='form_group p_relative'>
                            <label>
                                <span className='label_name'>Upload Images*</span>
                                <input type="file" accept=".png, .jpg, .jpeg" multiple onChange={handleImageChange} />
                                <div className="image-list">
                                    {fileNames.map((imageName, index) => (
                                        <div key={index} className="image-item">
                                            {index === fileNames.length - 1 && ( // Render only for the last image
                                                <img src={URL.createObjectURL(files[index])} alt="" style={{ width: '100px', height: 'auto', marginRight: '10px' }} />
                                            )}
                                            <span>{imageName}</span>
                                            <button type="button" onClick={() => removeImage(index)}>X</button>
                                        </div>
                                    ))}
                                </div>
                                {errors?.images && <p className="error-message">{errors.images.message}</p>}
                            </label>
                        </div>

                        <div className='form_group'>
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

export default CreateProduct;
