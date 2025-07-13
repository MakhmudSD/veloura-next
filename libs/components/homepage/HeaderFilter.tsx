import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button, Typography, Slider } from '@mui/material';
// Removed ToggleButtonGroup, ToggleButton imports as they are not used for Options anymore
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
// Removed FormControl, Select, MenuItem imports as they are no longer used for Year
// import FormControl from '@mui/material/FormControl'; // Removed
// import Select from '@mui/material/Select';           // Removed
// import MenuItem from '@mui/material/MenuItem';         // Removed
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { ProductsInquiry } from '../../types/product/product.input';
import { ProductCategory, ProductGender, ProductLocation, ProductMaterial } from '../../enums/product.enum';
import { productPrice, productYears } from '../../config';


// UPDATED 'modalStyle' object with pure white background
const modalStyle = (open: boolean) => ({
	position: 'absolute' as const,
	top: '50%',
	left: '50%',
	transform: open ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)',
	width: '95%',
	maxWidth: '900px', // Adjusted maxWidth for a wider look
	bgcolor: '#FFFFFF', // Reverted to PURE WHITE for modal background
	border: '4px solid #D4AF37', // Gold accent border
	borderRadius: '20px',
	outline: 'none',
	boxShadow: '0 25px 90px rgba(0, 0, 0, 0.8)', // More prominent, darker shadow
	padding: { xs: '30px', md: '60px 70px' },
	opacity: open ? 1 : 0,
	transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
});

// MenuProps is no longer strictly needed as Select components for Year are removed
// Keeping as a placeholder if other Selects unexpectedly appear or for future use
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '250px',
			backgroundColor: '#2E8B57', // Dark Green for dropdown background
			color: '#FFFFFF', // White text for dropdown items
			borderRadius: '8px',
			marginTop: '8px',
		},
	},
    MenuListProps: {
        sx: {
            '& .MuiMenuItem-root': {
                fontSize: '1.1rem',
                '&:hover': {
                    backgroundColor: 'rgba(212, 175, 55, 0.2)', // Subtle gold hover
                },
                '&.Mui-selected': {
                    backgroundColor: 'rgba(212, 175, 55, 0.4)', // Gold selected background
                    color: '#FFFFFF', // White text on selected
                },
            },
        },
    },
};


const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
	initialInput: ProductsInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const router = useRouter();

	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(initialInput);
	const [yearCheck, setYearCheck] = useState({ start: 2020, end: thisYear });
	const [optionCheck, setOptionCheck] = useState('all');

	const locationRef = useRef<any>();
	const categoryRef = useRef<any>();
	const materialRef = useRef<any>();

	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openLocation, setOpenLocation] = useState(false);
	const [openCategory, setOpenCategory] = useState(false);
	const [openMaterial, setOpenMaterial] = useState(false);

	const [productLocation] = useState<ProductLocation[]>(Object.values(ProductLocation));
	const [productCategory] = useState<ProductCategory[]>(Object.values(ProductCategory));

	const [searchActive, setSearchActive] = React.useState(false);
	const [searchText, setSearchText] = React.useState('');

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) setOpenLocation(false);
			if (!categoryRef?.current?.contains(event.target)) setOpenCategory(false);
			if (!materialRef?.current?.contains(event.target)) setOpenMaterial(false);
		};
		document.addEventListener('mousedown', clickHandler);
		return () => document.removeEventListener('mousedown', clickHandler);
	}, []);

	/** HANDLERS **/
	const advancedFilterHandler = (status: boolean) => {
		setOpenAdvancedFilter(status);
		setOpenLocation(false);
		setOpenMaterial(false);
		setOpenCategory(false);
	};

	const locationStateChangeHandler = () => {
		setOpenLocation((prev) => !prev);
		setOpenMaterial(false);
		setOpenCategory(false);
	};

	const categoryStateChangeHandler = () => {
		setOpenCategory((prev) => !prev);
		setOpenLocation(false);
		setOpenMaterial(false);
	};

	const materialStateChangeHandler = () => {
		setOpenMaterial((prev) => !prev);
		setOpenCategory(false);
		setOpenLocation(false);
	};

	const disableAllStateHandler = () => {
		setOpenLocation(false);
		setOpenCategory(false);
		setOpenMaterial(false);
	};

	const productLocationSelectHandler = useCallback(async (value: any) => {
		setSearchFilter((prev) => ({
			...prev,
			search: { ...prev.search, locationList: [value] },
		}));
		locationStateChangeHandler();
	}, []);

	const productCategorySelectHandler = useCallback(async (value: any) => {
		setSearchFilter((prev) => ({
			...prev,
			search: { ...prev.search, categoryList: [value] },
		}));
		categoryStateChangeHandler();
	}, []);

	const productMaterialSelectHandler = useCallback(async (value: any) => {
		setSearchFilter((prev) => ({
			...prev,
			search: { ...prev.search, materialList: [value] },
		}));
		disableAllStateHandler();
	}, []);

	const productGenderSelectHandler = useCallback(
		async (gender: ProductGender | null) => {
			if (!gender) {
				const updatedSearch = { ...searchFilter.search };
				delete updatedSearch.genderList;
				setSearchFilter({ ...searchFilter, search: updatedSearch });
			} else if (searchFilter?.search?.genderList?.includes(gender)) {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						genderList: searchFilter.search.genderList.filter((g) => g !== gender),
					},
				});
			} else {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						genderList: [...(searchFilter.search.genderList || []), gender],
					},
				});
			}
		},
		[searchFilter],
	);

    const productOptionSelectHandler = useCallback(
        async (option: string | null) => {
            if (!option || option === 'all') {
                const updatedSearch = { ...searchFilter.search };
                delete updatedSearch.options;
                setSearchFilter({ ...searchFilter, search: updatedSearch });
                setOptionCheck('all');
            } else if (searchFilter?.search?.options?.includes(option)) {
                setSearchFilter({
                    ...searchFilter,
                    search: {
                        ...searchFilter.search,
                        options: searchFilter.search.options.filter((o) => o !== option),
                    },
                });
                setOptionCheck('all'); // If deselected, go back to 'all' for display logic
            } else {
                setSearchFilter({
                    ...searchFilter,
                    search: {
                        ...searchFilter.search,
                        options: [option],
                    },
                });
                setOptionCheck(option);
            }
        },
        [searchFilter],
    );

    // Price Slider Handler (remains)
    const productPriceSliderHandler = useCallback(
        (event: Event, newValue: number | number[]) => {
            const [startPrice, endPrice] = newValue as number[];
            setSearchFilter({
                ...searchFilter,
                search: {
                    ...searchFilter.search,
                    pricesRange: { start: startPrice, end: endPrice },
                },
            });
        },
        [searchFilter],
    );

    // UPDATED: Year selection handler for individual buttons
	const productYearSelectHandler = useCallback(
		async (year: number | null, type: 'start' | 'end') => {
		  const updatedYearCheck = { ...yearCheck };
		  const updatedSearchFilter = {
			...searchFilter,
			search: {
			  ...searchFilter.search,
			  dateRange: {
				start: searchFilter.search?.dateRange?.start ?? productYears[0],
				end: searchFilter.search?.dateRange?.end ?? thisYear,
			  },
			},
		  };
	  
		  if (type === 'start') {
			updatedYearCheck.start = year ?? productYears[0];
			updatedSearchFilter.search.dateRange.start = year ?? productYears[0];
		  } else {
			updatedYearCheck.end = year ?? thisYear;
			updatedSearchFilter.search.dateRange.end = year ?? thisYear;
		  }
	  
		  setYearCheck(updatedYearCheck);
		  setSearchFilter(updatedSearchFilter);
		},
		[searchFilter, yearCheck],
	  );
	  


	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
		setYearCheck({ start: 2020, end: thisYear });
	};
	const pushSearchHandler = async () => {
		try {
			const copy = { ...searchFilter };

			if (copy?.search?.locationList?.length === 0) delete copy.search.locationList;
			if (copy?.search?.categoryList?.length === 0) delete copy.search.categoryList;
			if (copy?.search?.materialList?.length === 0) delete copy.search.materialList;
			if (copy?.search?.options?.length === 0) delete copy.search.options;
			if (copy?.search?.genderList?.length === 0) delete copy.search.genderList;

			await router.push(`/product?input=${JSON.stringify(copy)}`);
		} catch (err: any) {
			console.error('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				{/* MAIN DESKTOP FILTER BAR (UNTOUCHED) */}
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						{/* LOCATION SELECT BOX */}
						<Box component={'div'} className={`box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler}>
							<span>{searchFilter?.search?.locationList?.[0] || t('Location')}</span>
							<ExpandMoreIcon />
						</Box>

						{/* CATEGORY SELECT BOX */}
						<Box className={`box ${openCategory ? 'on' : ''}`} onClick={categoryStateChangeHandler}>
							<span>{searchFilter?.search?.categoryList?.[0] || t('Product Category')}</span>
							<ExpandMoreIcon />
						</Box>

						{/* MATERIAL SELECT BOX */}
						<Box className={`box ${openMaterial ? 'on' : ''}`} onClick={materialStateChangeHandler}>
							<span>{searchFilter?.search?.materialList?.[0] || t('Material')}</span>
							<ExpandMoreIcon />
						</Box>

						{/* ADVANCED FILTER */}
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="Settings Icon" />
							<span>{t('Advanced')}</span>
						</Box>

						{/* SEARCH BUTTON */}
						<Box
							className={'search-text'}
							onClick={() => {
								// ✅ Trigger your search action here!
								pushSearchHandler();
							}}
						>
							<img src="/img/icons/search_white.svg" alt="Search Icon" />
						</Box>
					</Stack>

					{/* DROPDOWNS */}
					<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
						{productLocation.map((location) => (
							<div onClick={() => productLocationSelectHandler(location)} key={location}>
								<img src={`/img/banner/cities/${location}.webp`} alt={location} />
								<span>{location}</span>
							</div>
						))}
					</div>

					<div className={`filter-category ${openCategory ? 'on' : ''}`} ref={categoryRef}>
						{productCategory.map((category) => (
							<div key={category} onClick={() => productCategorySelectHandler(category)}>
								<img src={`/img/banner/types/${category.toLowerCase()}.webp`} alt={category} />
								<span>{category}</span>
							</div>
						))}
					</div>

					<div className={`filter-material ${openMaterial ? 'on' : ''}`} ref={materialRef}>
						{['GOLD', 'SILVER', 'PLATINUM', 'DIAMOND'].map((material) => (
							<div key={material} onClick={() => productMaterialSelectHandler(material)}>
								<img src={`/img/banner/materials/${material.toLowerCase()}.webp`} alt={material} />
								<span>{material}</span>
							</div>
						))}
					</div>
				</Stack>

				{/* ADVANCED FILTER MODAL (MODIFIED SECTION) */}
				<Modal
                    open={openAdvancedFilter}
                    onClose={() => advancedFilterHandler(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    {/* Pass the open state to modalStyle */}
                    <Box sx={modalStyle(openAdvancedFilter)}>
                        <Box className={'advanced-filter-modal'}>
                            {/* Close button - now more visible */}
                            <Box
                                className={'close'} // Existing class
                                onClick={() => advancedFilterHandler(false)}
                                sx={{
                                    position: 'absolute',
                                    top: '-20px', // Slightly closer to the edge
                                    right: '-20px',
                                    backgroundColor: '#D4AF37', // Gold background
                                    color: '#FFFFFF', // White X
                                    borderRadius: '50%',
                                    width: '45px', // Larger
                                    height: '45px', // Larger
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 6px 15px rgba(0,0,0,0.4)', // More prominent shadow
                                    transition: 'all 0.3s ease',
                                    border: '2px solid #FFFFFF', // White border for contrast
                                    '&:hover': {
                                        backgroundColor: '#2E8B57', // Dark green on hover
                                        transform: 'scale(1.15)', // More pronounced hover effect
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        fontSize: '2rem', // Larger X icon
                                    },
                                    '@media (max-width: 960px)': { // Responsive
                                        top: '10px',
                                        right: '10px',
                                        width: '35px', // Slightly smaller on mobile
                                        height: '35px',
                                        '& .MuiSvgIcon-root': {
                                            fontSize: '1.5rem',
                                        },
                                    },
                                }}
                            >
                                <CloseIcon />
                            </Box>

                            {/* Title - using Typography for bigger, elegant font, hardcoded colors */}
                            <Typography
                                component="span" // Using span as component to keep existing class behavior if any
                                sx={{
                                    marginBottom: '30px', // Apply margin directly for consistency
                                    textAlign: 'center',
                                    color: '#D4AF37', // Gold
                                    fontSize: { xs: '2rem', md: '2.8rem' }, // Even bigger, elegant font
                                    fontWeight: 700, // Make it bold
                                    display: 'block', // To make span act like a block for margin/text-align
                                    fontFamily: '"Playfair Display", Georgia, serif', // Elegant font
                                }}
                            >
                                Find your jewelry
                            </Typography>
                            
                            {/* Search input box - WIDER & BIGGER */}
                            <div className={'search-input-box'}> {/* Styles in SCSS */}
                                <img src="/img/icons/search.svg" alt="" />
                                <input
                                    value={searchFilter?.search?.text ?? ''}
                                    type="text"
                                    placeholder={'What are you looking for?'}
                                    onChange={(e) =>
                                        setSearchFilter({
                                            ...searchFilter,
                                            search: { ...searchFilter.search, text: e.target.value },
                                        })
                                    }
                                    // onFocus/onBlur are handled by SCSS using :focus pseudo-class
                                />
                            </div>

                            <Divider sx={{ mt: '30px', mb: '35px', borderColor: '#D4AF37' }} /> {/* Gold divider */}

                            <div className={'middle'}>
                                {/* GENDER & OPTIONS SECTIONS - Arranged in 2 columns (or stacked on mobile) */}
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 5 }} sx={{ marginBottom: '40px' }}>
                                    <div className={'box'} style={{ flex: 1 }}>
                                        <Typography component="span" sx={{ fontWeight: 600, marginBottom: '15px', color: '#2E8B57', display: 'block', fontSize: '1.2rem', fontFamily: '"Playfair Display", Georgia, serif' }}>Gender</Typography>
                                        <div className={'inside'} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {/* Gender Buttons */}
                                            <Button
                                                className={`room ${
                                                    !searchFilter?.search?.genderList || searchFilter.search.genderList.length === 0
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() => productGenderSelectHandler(null)}
                                                sx={{ // Apply Material UI button styling here
                                                    borderRadius: '20px',
                                                    padding: '10px 22px', // Slightly larger padding
                                                    border: `1px solid #2E8B57`, // Dark green border
                                                    backgroundColor: '#2E8B57', // Dark green background
                                                    color: '#FFFFFF', // White text on dark green modal background
                                                    fontSize: '1.1rem', // Standard font size
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&.active': {
                                                        backgroundColor: '#D4AF37', // Gold active
                                                        color: '#000000', // Black text on gold
                                                        borderColor: '#D4AF37',
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#D4AF37', // Gold on hover
                                                        color: '#000000', // Black text on gold
                                                        borderColor: '#D4AF37',
                                                    },
                                                }}
                                            >
                                                Any
                                            </Button>
                                            {Object.values(ProductGender).map((gender) => (
                                                <Button
                                                    key={gender}
                                                    className={`room ${searchFilter?.search?.genderList?.includes(gender) ? 'active' : ''}`}
                                                    onClick={() => productGenderSelectHandler(gender)}
                                                    sx={{ // Apply Material UI button styling here
                                                        borderRadius: '20px',
                                                        padding: '10px 22px',
                                                        border: `1px solid #2E8B57`,
                                                        backgroundColor: '#2E8B57',
                                                        color: '#FFFFFF',
                                                        fontSize: '1.1rem',
                                                        transition: 'all 0.2s ease-in-out',
                                                        '&.active': {
                                                            backgroundColor: '#D4AF37',
                                                            color: '#000000',
                                                            borderColor: '#D4AF37',
                                                        },
                                                        '&:hover': {
                                                            backgroundColor: '#D4AF37',
                                                            color: '#000000',
                                                            borderColor: '#D4AF37',
                                                        },
                                                    }}
                                                >
                                                    {gender.charAt(0) + gender.slice(1).toLowerCase()}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* OPTIONS SECTION - SAME STYLE AS GENDER */}
                                    <div className={'box'} style={{ flex: 1 }}>
                                        <Typography component="span" sx={{ fontWeight: 600, marginBottom: '15px', color: '#2E8B57', display: 'block', fontSize: '1.2rem', fontFamily: '"Playfair Display", Georgia, serif' }}>Options</Typography>
                                        <div className={'inside'}>
                                            {/* Individual Buttons for Options, styled like Gender buttons */}
                                            <Button
                                                className={`room ${optionCheck === 'all' ? 'active' : ''}`}
                                                onClick={() => productOptionSelectHandler('all')}
                                                sx={{
                                                    borderRadius: '20px',
                                                    padding: '10px 22px',
                                                    border: `1px solid #2E8B57`,
                                                    backgroundColor: '#2E8B57',
                                                    color: '#FFFFFF',
                                                    fontSize: '1.1rem',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&.active': {
                                                        backgroundColor: '#D4AF37',
                                                        color: '#000000',
                                                        borderColor: '#D4AF37',
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#D4AF37',
                                                        color: '#000000',
                                                        borderColor: '#D4AF37',
                                                    },
                                                }}
                                            >
                                                All Options
                                            </Button>
                                            <Button
                                                className={`room ${optionCheck === 'productBarter' ? 'active' : ''}`}
                                                onClick={() => productOptionSelectHandler('productBarter')}
                                                sx={{
                                                    borderRadius: '20px',
                                                    padding: '10px 22px',
                                                    border: `1px solid #2E8B57`,
                                                    backgroundColor: '#2E8B57',
                                                    color: '#FFFFFF',
                                                    fontSize: '1.1rem',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&.active': {
                                                        backgroundColor: '#D4AF37',
                                                        color: '#000000',
                                                        borderColor: '#D4AF37',
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#D4AF37',
                                                        color: '#000000',
                                                        borderColor: '#D4AF37',
                                                    },
                                                }}
                                            >
                                                Barter
                                            </Button>
                                            <Button
                                                className={`room ${optionCheck === 'productRent' ? 'active' : ''}`}
                                                onClick={() => productOptionSelectHandler('productRent')}
                                                sx={{
                                                    borderRadius: '20px',
                                                    padding: '10px 22px',
                                                    border: `1px solid #2E8B57`,
                                                    backgroundColor: '#2E8B57',
                                                    color: '#FFFFFF',
                                                    fontSize: '1.1rem',
                                                    transition: 'all 0.2s ease-in-out',
                                                    '&.active': {
                                                        backgroundColor: '#D4AF37',
                                                        color: '#000000',
                                                        borderColor: '#D4AF37',
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#D4AF37',
                                                        color: '#000000',
                                                        borderColor: '#D4AF37',
                                                    },
                                                }}
                                            >
                                                Rent
                                            </Button>
                                        </div>
                                    </div>
                                </Stack>
                                
                                {/* YEAR SECTION - As clickable buttons, like Gender/Options */}
                                <div className={'row-box'} style={{ marginBottom: '40px' }}>
                                    <div className={'box'} style={{ flex: 1 }}>
                                        <Typography component="span" sx={{ fontWeight: 600, marginBottom: '15px', color: '#2E8B57', display: 'block', fontSize: '1.2rem', fontFamily: '"Playfair Display", Georgia, serif' }}>Year Built Range</Typography>
                                        <div className={'inside'} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {/* Start Year Buttons */}
                                            <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ maxWidth: '45%'}}>
                                                <Typography component="span" sx={{ fontSize: '1.1rem', color: '#2E8B57', minWidth: '40px', fontFamily: '"Playfair Display", Georgia, serif' }}>FROM</Typography>
                                                {productYears.map((year) => (
                                                    <Button
                                                        key={`start-${year}`}
                                                        className={`room ${yearCheck.start === year ? 'active' : ''}`}
                                                        onClick={() => productYearSelectHandler(year, 'start')}
                                                        sx={{
                                                            borderRadius: '20px',
                                                            padding: '10px 15px',
                                                            border: `1px solid #2E8B57`,
                                                            backgroundColor: '#2E8B57',
                                                            color: '#FFFFFF',
                                                            fontSize: '1.0rem',
                                                            transition: 'all 0.2s ease-in-out',
                                                            '&.active': {
                                                                backgroundColor: '#D4AF37',
                                                                color: '#000000',
                                                                borderColor: '#D4AF37',
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: '#D4AF37',
                                                                color: '#000000',
                                                                borderColor: '#D4AF37',
                                                            },
                                                        }}
                                                        disabled={year >= yearCheck.end} // Disable if start year is greater than or equal to end year
                                                    >
                                                        {year}
                                                    </Button>
                                                ))}
                                            </Stack>
                                            
                                            <Divider sx={{ width: '20px', height: '2px', bgcolor: '#D4AF37', flexShrink: 0 }} /> {/* Gold Divider */}

                                            {/* End Year Buttons */}
                                            <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ maxWidth: '45%'}}>
                                                <Typography component="span" sx={{ fontSize: '1.1rem', color: '#2E8B57', minWidth: '30px', fontFamily: '"Playfair Display", Georgia, serif' }}>TO</Typography>
                                                {productYears.slice().reverse().map((year) => ( // Reverse for end year
                                                    <Button
                                                        key={`end-${year}`}
                                                        className={`room ${yearCheck.end === year ? 'active' : ''}`}
                                                        onClick={() => productYearSelectHandler(year, 'end')}
                                                        sx={{
                                                            borderRadius: '20px',
                                                            padding: '10px 15px',
                                                            border: `1px solid #2E8B57`,
                                                            backgroundColor: '#2E8B57',
                                                            color: '#FFFFFF',
                                                            fontSize: '1.0rem',
                                                            transition: 'all 0.2s ease-in-out',
                                                            '&.active': {
                                                                backgroundColor: '#D4AF37',
                                                                color: '#000000',
                                                                borderColor: '#D4AF37',
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: '#D4AF37',
                                                                color: '#000000',
                                                                borderColor: '#D4AF37',
                                                            },
                                                        }}
                                                        disabled={year <= yearCheck.start} // Disable if end year is less than or equal to start year
                                                    >
                                                        {year}
                                                    </Button>
                                                ))}
                                            </Stack>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* KRW PRICE SECTION - Using Slider for range, bigger font */}
                                <div className={'row-box'}> {/* Ensure full width for this row */}
                                    <div className={'box'} style={{ flex: 1 }}>
                                        <Typography component="span" sx={{ fontWeight: 600, marginBottom: '15px', color: '#2E8B57', display: 'block', fontSize: '1.2rem', fontFamily: '"Playfair Display", Georgia, serif' }}>KRW Price Range</Typography>
                                        <Box sx={{ width: '100%', margin: '0 auto', padding: '0 10px' }}> {/* Slider container, stretched */}
                                            <Slider
                                                value={[searchFilter?.search?.pricesRange?.start || 0, searchFilter?.search?.pricesRange?.end || 2000000]}
                                                onChange={productPriceSliderHandler}
                                                valueLabelDisplay="auto"
                                                min={0}
                                                max={2000000} // Your max price from config, adjust if productPrice array provides it dynamically
                                                step={10000} // Adjust step as needed (e.g., 10,000 KRW increments)
                                                sx={{
                                                    color: '#D4AF37', // Gold slider track
                                                    height: 8,
                                                    '& .MuiSlider-thumb': {
                                                        height: 24,
                                                        width: 24,
                                                        backgroundColor: '#FFFFFF', // White thumb
                                                        border: '2px solid #D4AF37', // Gold border
                                                        '&:focus, &:hover, &.Mui-active': {
                                                            boxShadow: 'inherit',
                                                        },
                                                    },
                                                    '& .MuiSlider-valueLabel': { // Label above thumb
                                                        backgroundColor: '#D4AF37', // Gold label background
                                                        color: '#FFFFFF', // White label text
                                                        fontSize: '1.1rem', // Bigger font
                                                        borderRadius: '5px',
                                                        padding: '3px 8px',
                                                        fontFamily: '"Playfair Display", Georgia, serif', // Elegant font
                                                    },
                                                    '& .MuiSlider-track': {
                                                        border: 'none',
                                                        backgroundColor: '#D4AF37', // Gold track fill
                                                    },
                                                    '& .MuiSlider-rail': {
                                                        backgroundColor: '#95A5A6', // A neutral grey, close to white but distinct
                                                    },
                                                }}
                                            />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography component="span" sx={{ color: '#2E8B57', fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.1rem' }}> {/* Bigger font, Dark Green text */}
                                                    {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(searchFilter?.search?.pricesRange?.start || 0)}
                                                </Typography>
                                                <Typography component="span" sx={{ color: '#2E8B57', fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.1rem' }}> {/* Bigger font, Dark Green text */}
                                                    {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(searchFilter?.search?.pricesRange?.end || 2000000)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </div>
                                </div>

                            </div> {/* End of .middle */}

                            <Divider sx={{ mt: '60px', mb: '18px', borderColor: '#D4AF37' }} /> {/* Gold divider */}

                            <div className={'bottom'}>
                                {/* Reset Filters Button - Elegant and matching */}
                                <Button
                                    onClick={resetFilterHandler}
                                    sx={{
                                        fontSize: '1.2rem', // Bigger font
                                        fontWeight: 600,
                                        color: '#2E8B57', // Dark Green text by default
                                        transition: 'all 0.3s ease',
                                        fontFamily: '"Playfair Display", Georgia, serif', // Elegant font
                                        padding: '12px 25px', // Consistent padding for buttons
                                        borderRadius: '12px',
                                        border: '2px solid #2E8B57', // Dark green border
                                        backgroundColor: 'transparent', // Transparent background
                                        '&:hover': {
                                            color: '#000000', // Black text on hover
                                            backgroundColor: '#D4AF37', // Gold background on hover
                                            textDecoration: 'none', // Remove underline on hover
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Subtle shadow
                                        },
                                        '& img': {
                                            filter: 'brightness(0) invert(0) sepia(0) saturate(0) hue-rotate(0deg)', // Keep icon black
                                            marginRight: '8px',
                                            width: '24px', // Larger icon
                                            transition: 'filter 0.3s ease',
                                        },
                                        '&:hover img': {
                                            filter: 'brightness(0) invert(0)', // Icon remains black on hover for contrast on gold
                                        }
                                    }}
                                    startIcon={<img src="/img/icons/reset.svg" alt="" />}
                                >
                                    Reset filters
                                </Button>
                                
                                {/* Search Button - Matching elegance and dark green */}
                                <Button
                                    startIcon={<img src={'/img/icons/search.svg'} alt="Search Icon" style={{
                                        filter: 'brightness(0) invert(1)', // White search icon
                                        width: '24px', // Larger icon
                                    }} />}
                                    className={'search-btn'} // Existing class
                                    onClick={pushSearchHandler}
                                    sx={{
                                        backgroundColor: '#2E8B57', // Dark Green background
                                        color: '#FFFFFF', // White text
                                        fontSize: '1.3rem', // Even bigger font
                                        fontWeight: 700,
                                        padding: '14px 35px', // Larger padding
                                        borderRadius: '12px',
                                        boxShadow: '0 6px 16px rgba(0,0,0,0.4)', // More prominent shadow
                                        transition: 'all 0.3s ease',
                                        fontFamily: '"Playfair Display", Georgia, serif', // Elegant font
                                        '&:hover': {
                                            backgroundColor: '#D4AF37', // Gold background on hover
                                            color: '#000000', // Black text on gold
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                                        },
                                        '&:hover img': {
                                            filter: 'brightness(0) invert(0)', // Icon becomes black on hover for contrast on gold
                                        }
                                    }}
                                >
                                    Search
                                </Button>
                            </div>
                        </Box>
                    </Box>
                </Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
			dateRange: {
				start: 2020,
				end: new Date().getFullYear(),
			},
			locationList: [],
			categoryList: [],
			materialList: [],
			genderList: [],
			options: [],
			text: '',
		},
	},
};

export default HeaderFilter;