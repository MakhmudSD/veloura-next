import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_ORDERS } from '../../apollo/user/query';
import { UPDATE_ORDER } from '../../apollo/user/mutation';

const Wishlist = () => {
	const { data, loading, error, refetch } = useQuery(GET_MY_ORDERS, {
		variables: { input: { status: 'PAUSE' } }, // only get unconfirmed orders
		fetchPolicy: 'network-only',
	});

	const [updateOrder] = useMutation(UPDATE_ORDER);

	const handleCheckout = async (orderId: string) => {
		try {
			await updateOrder({
				variables: {
					input: {
						id: orderId,
						orderStatus: 'PAID',
					},
				},
			});
			alert('Order confirmed!');
			refetch();
		} catch (err: any) {
			console.error('Checkout failed:', err.message);
		}
	};

	if (loading) return <p>Loading wishlist...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const wishlistOrder = data?.getMyOrders?.[0];

	if (!wishlistOrder) return <p>No items in wishlist yet.</p>;

	return (
		<div>
			<h2>Your Wishlist</h2>
			<ul>
				{wishlistOrder.items.map((item: any) => (
					<li key={item.id}>
						<img src={item.productId.image} width={60} />
						<p>{item.productId.name}</p>
						<p>₩{item.itemPrice} × {item.itemQuantity}</p>
					</li>
				))}
			</ul>
			<button onClick={() => handleCheckout(wishlistOrder.id)}>Checkout</button>
		</div>
	);
};

export default Wishlist;