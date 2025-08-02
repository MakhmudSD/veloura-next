import { Stack } from "@mui/system";

const Shipping = () => {
    return (
        <Stack className="shipping">
            <Stack className="container">
                <Stack className="shipping-content">
                    <Stack className="shipping-icon">
                        <img src="/img/shipping/delivery.svg" alt="Shipping Icon" />
                    </Stack>
                    <Stack className="shipping-info">
                        <h1>FREE SHIPPING</h1>
                        <p>
                        Happy to offer international shipping for a flat rate of $40
                        </p>
                    </Stack>                                
                </Stack>
                <Stack className="shipping-content">
                    <Stack className="shipping-icon">
                        <img src="/img/shipping/customer-servic.svg" alt="CS Icon" />
                    </Stack>
                    <Stack className="shipping-info">
                        <h1>Support 24/7</h1>
                        <p>
                            Contact Us 24 Hours A Day, 
                            7 Days A Week
                        </p>
                    </Stack>                                
                </Stack>
                <Stack className="shipping-content">
                    <Stack className="shipping-icon">
                        <img src="/img/shipping/return.svg" alt="Return Icon" />
                    </Stack>
                    <Stack className="shipping-info">
                        <h1>EASY RETURNS</h1>
                        <p>
                            Return  within 30 days for a full refund or exchange.
                        </p>
                    </Stack>                                
                </Stack>
                <Stack className="shipping-content">
                    <Stack className="shipping-icon">
                        <img src="/img/shipping/payment.svg" alt="Payment Icon" />
                    </Stack>
                    <Stack className="shipping-info">
                        <h1>100% Secure</h1>
                        <p>
                            Shop with confidence knowing your data is protected.
                        </p>
                    </Stack>                                
                </Stack>
            </Stack>
        </Stack>
    );
}

export default Shipping;