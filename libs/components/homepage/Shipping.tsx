import { Stack } from "@mui/system";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useTranslation } from "next-i18next";

const Shipping = () => {
        const device = useDeviceDetect();
      const { t } = useTranslation('common');

    if(device === 'mobile') {
        return (
            <Stack className="shipping mobile">
                <Stack className="container">
                    <Stack className="shipping-content">
                        <Stack className="shipping-icon">
                            <img src="/img/shipping/delivery.svg" alt="Shipping Icon" />
                        </Stack>
                        <Stack className="shipping-info">
                            <h1>{t('FREE SHIPPING')}</h1>
                            <p>
                                {t('Happy to offer international shipping for a flat rate of $40')}
                            </p>
                        </Stack>                                
                    </Stack>
                    <Stack className="shipping-content">
                        <Stack className="shipping-icon">
                            <img src="/img/shipping/customer-servic.svg" alt="CS Icon" />
                        </Stack>
                        <Stack className="shipping-info">
                            <h1>{t('Support 24/7')}</h1>
                            <p>
                                {t('Contact Us 24 Hours A Day, 7 Days A Week')}
                            </p>
                        </Stack>                                
                    </Stack>
                    <Stack className="shipping-content">
                        <Stack className="shipping-icon">
                            <img src="/img/shipping/return.svg" alt="Return Icon" />
                        </Stack>
                        <Stack className="shipping-info">
                            <h1>{t('EASY RETURNS')}</h1>
                            <p>
                                {t('Return  within 30 days for a full refund or exchange.')}
                            </p>
                        </Stack>                                
                    </Stack>
                    <Stack className="shipping-content">
                        <Stack className="shipping-icon">
                            <img src="/img/shipping/payment.svg" alt="Payment Icon" />
                        </Stack>
                        <Stack className="shipping-info">
                            <h1>{t('100% Secure')}</h1>
                            <p>
                                {t('Shop with confidence knowing your data is protected.')}
                            </p>
                        </Stack>                                
                    </Stack>
                </Stack>
            </Stack>
        );
    } 
    return (
        <Stack className="shipping">
            <Stack className="container">
                <Stack className="shipping-content">
                    <Stack className="shipping-icon">
                        <img src="/img/shipping/delivery.svg" alt="Shipping Icon" />
                    </Stack>
                    <Stack className="shipping-info">
                        <h1>{t('FREE SHIPPING')}</h1>
                        <p>
                        {t('Happy to offer international shipping for a flat rate of $40')}
                        </p>
                    </Stack>                                
                </Stack>
                <Stack className="shipping-content">
                    <Stack className="shipping-icon">
                        <img src="/img/shipping/customer-servic.svg" alt="CS Icon" />
                    </Stack>
                    <Stack className="shipping-info">
                        <h1>{t('Support 24/7')}</h1>
                        <p>
                            {t('Contact Us 24 Hours A Day, 7 Days A Week')}
                        </p>
                    </Stack>                                
                </Stack>
                <Stack className="shipping-content">
                    <Stack className="shipping-icon">
                        <img src="/img/shipping/return.svg" alt="Return Icon" />
                    </Stack>
                    <Stack className="shipping-info">
                        <h1>{t('EASY RETURNS')}</h1>
                        <p>
                            {t('Return  within 30 days for a full refund or exchange.')}
                        </p>
                    </Stack>                                
                </Stack>
                <Stack className="shipping-content">
                    <Stack className="shipping-icon">
                        <img src="/img/shipping/payment.svg" alt="Payment Icon" />
                    </Stack>
                    <Stack className="shipping-info">
                        <h1>{t('100% Secure')}</h1>
                        <p>
                            {t('Shop with confidence knowing your data is protected.')}
                        </p>
                    </Stack>                                
                </Stack>
            </Stack>
        </Stack>
    );
}

export default Shipping;