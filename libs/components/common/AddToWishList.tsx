import React from 'react';
import { basketItemsVar } from '../../../apollo/store';

interface ProductType {
  id: string;
  productTitle: string;
  productImages: string;
  productPrice: number;
}

interface Props {
  product: ProductType;
}

const AddToWishlistButton = ({ product }: Props) => {
  const handleAdd = () => {
    const currentItems = basketItemsVar();
    const index = currentItems.findIndex(item => item.productId === product.id);
    let updatedItems = [...currentItems];

    if (index > -1) {
      updatedItems[index].itemQuantity += 1;
    } else {
      updatedItems.push({
        id: product.id, // Assuming id is the same as productId
        _id: product.id, // Assuming _id is the same as productId
        productId: product.id,
        productTitle: product.productTitle,
        productImages: product.productImages,
        productPrice: product.productPrice,
        itemQuantity: 1,
      });
    }

    basketItemsVar(updatedItems);  // THIS MUST trigger reactive update!
  };
};

export default AddToWishlistButton;
