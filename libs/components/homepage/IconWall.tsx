import { Divider } from "@mui/material";
import { Box, Stack } from "@mui/system";
import useDeviceDetect from "../../hooks/useDeviceDetect"; // assuming you already have this
import { useTranslation } from "next-i18next";

const IconWall = () => {
    const device  = useDeviceDetect();
          const { t } = useTranslation('common');


    return (
        <Stack className={`icon-wall ${device === "mobile" ? "mobile" : "desktop"}`}>
            <Stack className="container">
                <Box className="icon-wrapper">
                    <img src="/img/events/globus.svg" alt="Icon Description" />
                    <span>{t('Connects All World Wide')}</span>
                </Box>
                <Divider />
                <Box className="icon-wrapper">
                    <img src="/img/events/leaf.svg" alt="Icon Description 2" className="img-rotate" />
                    <span>{t('Sustainability with Gold')}</span>
                </Box>
                <Divider />
                <Box className="icon-wrapper">
                    <img src="/img/events/letter.svg" alt="Icon Description 3" className="img-rotate" />
                    <span>{t('Share Your Passion')}</span>
                </Box>
                <Divider />
                <Box className="icon-wrapper">
                    <img src="/img/events/love.svg" alt="Icon Description 4" className="img-rotate" />
                    <span>{t('Expect Your Love')}</span>
                </Box>
                <Divider />
            </Stack>
        </Stack>
    );
};

export default IconWall;
