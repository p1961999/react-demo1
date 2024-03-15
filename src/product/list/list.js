import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import ProductService from '../productService';
import { useNavigate, useLocation } from 'react-router-dom';

const ProductInfoTable = () => {
    const location = useLocation();
    const addProductData = location.state;
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);

    const { data: fetchedData, isLoading, isError } = ProductService.useFetchProducts();

    const { data: mergedData } = useQuery('mergedProducts', () => {
        let mergedProducts = [];
        if (addProductData && fetchedData && fetchedData.products) {
            mergedProducts = [...fetchedData.products, addProductData];
            return mergedProducts;
        } else if (fetchedData && fetchedData.products) {
            return fetchedData.products;
        } else {
            return [];
        }
    }, { enabled: !isLoading && !isError });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching data</div>;
    }

    const currentProducts = Array.isArray(mergedData) ? mergedData.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage) : [];
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const ProductCard = ({ product }) => {
        return (
            <div className="product-card">
                <h2 className="product-title">{product.title}</h2>
                <div className="product-details">
                    <img src={product.thumbnail} alt={product.title} className="product-thumbnail" />
                   <div class="card_dtl">
                   <p className="product-description">{product.description}</p>
                    <p className="product-price">Price: ${product.price}</p>
                    <p className="product-rating">Rating: {product.rating}</p>
                    <p className="product-stock">Stock: {product.stock}</p>
                   </div>
                </div>
            </div>
        );
    };

    return (
        <div class="product_wrp">
          <div class="hdr"><h2>Product Details</h2>
            <button onClick={()=>navigate('/create')}>Add More</button>
            </div>
            <div className="product-list">
                {currentProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <div className="pagination">
                {mergedData && Array.from({ length: Math.ceil(mergedData.length / productsPerPage) }, (_, i) => (
                    <button key={i + 1} onClick={() => paginate(i + 1)}>{i + 1}</button>
                ))}
            </div>
        </div>
    );
};

export default ProductInfoTable;
