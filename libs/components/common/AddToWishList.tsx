import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '../../../apollo/user/mutation';

const AddToWishlistButton = ({ product }: { product: { id: string; price: number } }) => {
	const [createOrder, { loading }] = useMutation(CREATE_ORDER);

	const handleAddToWishlist = async () => {
		try {
			await createOrder({
				variables: {
					input: [
						{
							productId: product.id,
							itemQuantity: 1,
							itemPrice: product.price,
						},
					],
				},
			});
			alert('Item added to wishlist!');
		} catch (error: any) {
			console.error('Error adding to wishlist:', error.message);
		}
	};

	return <button onClick={handleAddToWishlist} disabled={loading}>Add to Wishlist</button>;
};

export default AddToWishlistButton;
