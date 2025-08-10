import { Divider } from "@mui/material";
import { Box, Stack } from "@mui/system";
import useDeviceDetect from "../../hooks/useDeviceDetect"; // assuming you already have this

const IconWall = () => {
    const device  = useDeviceDetect();

    return (
        <Stack className={`icon-wall ${device === "mobile" ? "mobile" : "desktop"}`}>
            <Stack className="container">
                <Box className="icon-wrapper">
                    <img src="/img/events/globus.svg" alt="Icon Description" />
                    <span>Connects All World Wide</span>
                </Box>
                <Divider />
                <Box className="icon-wrapper">
                    <img src="/img/events/leaf.svg" alt="Icon Description 2" className="img-rotate" />
                    <span>Sustainability with Gold</span>
                </Box>
                <Divider />
                <Box className="icon-wrapper">
                    <img src="/img/events/letter.svg" alt="Icon Description 3" className="img-rotate" />
                    <span>Share Your Passion</span>
                </Box>
                <Divider />
                <Box className="icon-wrapper">
                    <img src="/img/events/love.svg" alt="Icon Description 4" className="img-rotate" />
                    <span>Expect Your Love</span>
                </Box>
                <Divider />
            </Stack>
        </Stack>
    );
};

export default IconWall;
