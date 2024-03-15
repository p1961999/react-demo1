import { useQuery } from 'react-query';
import { useMutation } from 'react-query';

const usePostProduct = () => {
    return useMutation(async (formData) => {
        const response = await fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error('Failed to post product');
        }
        return response.json();
    });
};

const ProductService = {
    useFetchProducts: () => {
        return useQuery('products', async () => {
            const response = await fetch('https://dummyjson.com/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return response.json();
        });
    },

    usePostProduct
};

export default ProductService;