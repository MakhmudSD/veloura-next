import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { ProductsInquiry } from '../../types/product/product.input';
import { ProductCategory, ProductGender, ProductLocation, ProductMaterial } from '../../enums/product.enum';
import { productPrice, productYears } from '../../config';

const style = {
	position: 'absolute' as const,
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
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
		setOpenLocation(false);
		setOpenMaterial(false);
		setOpenCategory(false);
		setOpenAdvancedFilter(status);
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
		try {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					locationList: [value],
				},
			});
			categoryStateChangeHandler();
		} catch (err: any) {
			console.log('ERROR, productLocationSelectHandler:', err);
		}
	}, [searchFilter]);

	const productCategorySelectHandler = useCallback(async (value: any) => {
		try {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					categoryList: [value],
				},
			});
			materialStateChangeHandler();
		} catch (err: any) {
			console.log('ERROR, productCategorySelectHandler:', err);
		}
	},
	[searchFilter],
)

	const productMaterialSelectHandler = useCallback(async (value: any) => {
		try {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					materialList: [value],
				},
			});
			disableAllStateHandler();
		} catch (err: any) {
			console.log('ERROR, productMaterialSelectHandler:', err);
		}
	},
	[searchFilter],)

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
		async (e: any) => {
			const value = e.target.value;
			setOptionCheck(value);

			if (value !== 'all') {
				setSearchFilter({
					...searchFilter,
					search: { ...searchFilter.search, options: [value] },
				});
			} else {
				const updatedSearch = { ...searchFilter.search };
				delete updatedSearch.options;
				setSearchFilter({ ...searchFilter, search: updatedSearch });
			}
		},
		[searchFilter],
	);

	const productPriceRangeHandler = useCallback(
		async (e: any, type: string) => {
			const value = parseInt(e.target.value);
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					// @ts-ignore
					pricesRange: { ...searchFilter.search.pricesRange, [type]: value },
				},
			});
		},
		[searchFilter],
	);

	const yearStartChangeHandler = async (e: any) => {
		const value = Number(e.target.value);
		setYearCheck((prev) => ({ ...prev, start: value }));
		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				dateRange: { start: value, end: yearCheck.end },
			},
		});
	};

	const yearEndChangeHandler = async (e: any) => {
		const value = Number(e.target.value);
		setYearCheck((prev) => ({ ...prev, end: value }));
		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				dateRange: { start: yearCheck.start, end: value },
			},
		});
	};

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
		setYearCheck({ start: 2020, end: thisYear });
	};
	const pushSearchHandler = async () => {
		try {
		  const newSearchFilter = { ...searchFilter };
	  
		  // Remove empty arrays in search
		  if (newSearchFilter?.search?.locationList?.length === 0) {
			delete newSearchFilter.search.locationList;
		  }
		  if (newSearchFilter?.search?.categoryList?.length === 0) {
			delete newSearchFilter.search.categoryList;
		  }
		  if (newSearchFilter?.search?.materialList?.length === 0) {
			delete newSearchFilter.search.materialList;
		  }
		  if (newSearchFilter?.search?.options?.length === 0) {
			delete newSearchFilter.search.options;
		  }
		  if (newSearchFilter?.search?.genderList?.length === 0) {
			delete newSearchFilter.search.genderList;
		  }
	  
		  await router.push(
			`/product?input=${encodeURIComponent(JSON.stringify(newSearchFilter))}`,
			`/product?input=${encodeURIComponent(JSON.stringify(newSearchFilter))}`
		  );
		} catch (err: any) {
		  console.error('ERROR, pushSearchHandler:', err);
		}
	  };
	  
	  

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				{/* MAIN DESKTOP FILTER BAR */}
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

						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="Settings Icon" />
							<span>{t('Advanced')}</span>
						</Box>

						<Box className={'search-text'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="Search Icon" />
						</Box>
					</Stack>

					{/* LOCATION MENU */}
					<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
						{productLocation.map((location) => (
							<div onClick={() => productLocationSelectHandler(location)} key={location}>
								<img src={`/img/banner/cities/${location}.webp`} alt={location} />
								<span>{location}</span>
							</div>
						))}
					</div>

					{/* CATEGORY MENU */}
					<div className={`filter-category ${openCategory ? 'on' : ''}`} ref={categoryRef}>
						{productCategory.map((category) => (
							<div key={category} onClick={() => productCategorySelectHandler(category)}>
								<img src={`/img/banner/types/${category.toLowerCase()}.webp`} alt={category} />
								<span>{category}</span>
							</div>
						))}
					</div>

					{/* MATERIAL MENU */}
					<div className={`filter-material ${openMaterial ? 'on' : ''}`} ref={materialRef}>
						{['GOLD', 'SILVER', 'PLATINUM', 'DIAMOND'].map((material) => (
							<div key={material} onClick={() => productMaterialSelectHandler(material)}>
								<img src={`/img/banner/materials/${material.toLowerCase()}.webp`} alt={material} />
								<span>{material}</span>
							</div>
						))}
					</div>
				</Stack>

				{/* ADVANCED FILTER MODAL */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="advanced-filter-title"
					aria-describedby="advanced-filter-description"
				>
					<Box sx={style}>
						<Box className="advanced-filter-modal">
							{/* Close Button */}
							<button
								type="button"
								className="close"
								aria-label="Close Advanced Filter"
								onClick={() => advancedFilterHandler(false)}
							>
								<CloseIcon />
							</button>

							{/* Title and Search Input */}
							<section className="top">
								<span id="advanced-filter-title">Discover Your Perfect Piece</span>
								<div className="search-input-box">
									<img src="/img/icons/search.svg" alt="Search icon" />
									<input
										type="text"
										placeholder="What are you looking for?"
										value={searchFilter?.search?.text ?? ''}
										onChange={(e) =>
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											})
										}
										aria-describedby="advanced-filter-description"
									/>
								</div>
							</section>

							<Divider sx={{ mt: 4, mb: 5, borderColor: '#025927' }} />

							{/* Gender and Options Filters */}
							<section className="middle">
								<div className="row-box">
									{/* Gender Selector */}
									<div className="box">
										<span>Jewelry For</span>
										<div className="inside">
											<Button
												type="button"
												variant={
													!searchFilter?.search?.genderList || searchFilter.search.genderList.length === 0
														? 'contained'
														: 'outlined'
												}
												sx={{
													borderRadius: '30px',
													minWidth: 'auto',
													px: 3,
													py: 1,
													fontWeight: 600,
													fontFamily: 'inherit',
													borderColor: '#013220',
													color:
														!searchFilter?.search?.genderList || searchFilter.search.genderList.length === 0
															? 'white'
															: '#013220',
													bgcolor:
														!searchFilter?.search?.genderList || searchFilter.search.genderList.length === 0
															? '#013220'
															: '#f7f9f6',
													'&:hover': {
														bgcolor: '#025927',
														color: 'white',
														borderColor: '#025927',
													},
												}}
												onClick={() => productGenderSelectHandler(null)}
											>
												All
											</Button>

											{Object.values(ProductGender).map((gender) => {
												const isActive = searchFilter?.search?.genderList?.includes(gender);
												return (
													<Button
														key={gender}
														type="button"
														variant={isActive ? 'contained' : 'outlined'}
														sx={{
															borderRadius: '30px',
															minWidth: 'auto',
															px: 3,
															py: 2,
															fontWeight: 900,
															fontFamily: '$font',
															borderColor: '#013220',
															color: isActive ? 'white' : '#013220',
															bgcolor: isActive ? '#013220' : '#f7f9f6',
															textTransform: 'capitalize',
															'&:hover': {
																bgcolor: '#025927',
																color: 'white',
																borderColor: '#025927',
															},
														}}
														onClick={() => productGenderSelectHandler(gender)}
													>
														{gender.charAt(0) + gender.slice(1).toLowerCase()}
													</Button>
												);
											})}
										</div>
									</div>

									{/* Options Selector */}
									<div className="box">
										<span>Options</span>
										<div className="inside">
											<FormControl fullWidth>
												<Select
													value={optionCheck}
													onChange={productOptionSelectHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Select option' }}
													sx={{
														borderRadius: '12px',
														bgcolor: '#013220',
														color: 'white',
														fontFamily: '$font',
														'& .MuiSelect-icon': { color: 'white' },
														'& .MuiMenu-paper': { bgcolor: 'white', color: '#013220' },
														'& .MuiMenuItem-root.Mui-selected': { bgcolor: '#025927', color: 'white' },
														'& .MuiMenuItem-root:hover': { bgcolor: '#014d30', color: 'white' },
													}}
												>
													<MenuItem value="all">All Options</MenuItem>
													<MenuItem value="productBarter">Barter</MenuItem>
													<MenuItem value="productRent">Rent</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
								</div>

								{/* Year Built and Price Range */}
								<div className="row-box" style={{ marginTop: 44 }}>
									{/* Year Built */}
									<div className="box">
										<span>Crafted Year</span>
										<div className="inside space-between align-center">
											<FormControl sx={{ width: 122 }}>
												<Select
													value={yearCheck.start.toString()}
													onChange={yearStartChangeHandler}
													displayEmpty
													MenuProps={MenuProps}
													sx={{
														borderRadius: '12px',
														bgcolor: '#013220',
														color: 'white',
														'& .MuiSelect-icon': { color: 'white' },
														'& .MuiMenu-paper': { bgcolor: 'white', color: '#013220' },
														'& .MuiMenuItem-root.Mui-selected': { bgcolor: '#025927', color: 'white' },
														'& .MuiMenuItem-root:hover': { bgcolor: '#014d30', color: 'white' },
													}}
												>
													{productYears.map((year) => (
														<MenuItem key={year} value={year} disabled={yearCheck.end <= year}>
															{year}
														</MenuItem>
													))}
												</Select>
											</FormControl>

											<div className="minus-line" aria-hidden="true"></div>

											<FormControl sx={{ width: 122 }}>
												<Select
													value={yearCheck.end.toString()}
													onChange={yearEndChangeHandler}
													displayEmpty
													MenuProps={MenuProps}
													sx={{
														borderRadius: '12px',
														bgcolor: '#013220',
														color: 'white',
														'& .MuiSelect-icon': { color: 'white' },
														'& .MuiMenu-paper': { bgcolor: 'white', color: '#013220' },
														'& .MuiMenuItem-root.Mui-selected': { bgcolor: '#025927', color: 'white' },
														'& .MuiMenuItem-root:hover': { bgcolor: '#014d30', color: 'white' },
													}}
												>
													{productYears
														.slice()
														.reverse()
														.map((year) => (
															<MenuItem key={year} value={year} disabled={yearCheck.start >= year}>
																{year}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									</div>

									{/* Price Range */}
									<div className="box">
										<span>KRW</span>
										<div className="inside space-between align-center">
											<FormControl sx={{ width: 122 }}>
												<Select
													value={searchFilter?.search?.pricesRange?.start}
													onChange={(e) => productPriceRangeHandler(e, 'start')}
													displayEmpty
													MenuProps={MenuProps}
													sx={{
														borderRadius: '12px',
														bgcolor: '#013220',
														color: 'white',
														'& .MuiSelect-icon': { color: 'white' },
														'& .MuiMenu-paper': { bgcolor: 'white', color: '#013220' },
														'& .MuiMenuItem-root.Mui-selected': { bgcolor: '#025927', color: 'white' },
														'& .MuiMenuItem-root:hover': { bgcolor: '#014d30', color: 'white' },
													}}
												>
													{productPrice.map((price) => (
														<MenuItem
															key={price}
															value={price}
															disabled={(searchFilter?.search?.pricesRange?.end || 0) < price}
														>
															{price.toLocaleString()}
														</MenuItem>
													))}
												</Select>
											</FormControl>

											<div className="minus-line" aria-hidden="true"></div>

											<FormControl sx={{ width: 122 }}>
												<Select
													value={searchFilter?.search?.pricesRange?.end}
													onChange={(e) => productPriceRangeHandler(e, 'end')}
													displayEmpty
													MenuProps={MenuProps}
													sx={{
														borderRadius: '12px',
														bgcolor: '#013220',
														color: 'white',
														'& .MuiSelect-icon': { color: 'white' },
														'& .MuiMenu-paper': { bgcolor: 'white', color: '#013220' },
														'& .MuiMenuItem-root.Mui-selected': { bgcolor: '#025927', color: 'white' },
														'& .MuiMenuItem-root:hover': { bgcolor: '#014d30', color: 'white' },
													}}
												>
													{productPrice.map((price) => (
														<MenuItem
															key={price}
															value={price}
															disabled={(searchFilter?.search?.pricesRange?.start || 0) > price}
														>
															{price.toLocaleString()}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</section>

							<Divider sx={{ mt: 6, mb: 2, borderColor: '#025927' }} />

							{/* Reset and Search Buttons */}
							<section className="bottom">
								{/* RESET BUTTON */}
								<Button
									onClick={resetFilterHandler}
									startIcon={<img src="/img/icons/reset.svg" alt="Reset icon" style={{ width: 20, height: 20 }} />}
									variant="outlined"
									sx={{
										borderRadius: '30px',
										paddingX: 3,
										paddingY: 1.5,
										fontWeight: 600,
										fontSize: '16px',
										textTransform: 'none',
										color: '#6f7c6b', // muted green-gray text
										borderColor: '#6f7c6b',
										'&:hover': {
											bgcolor: '#f7f9f6', // subtle background on hover
											borderColor: '#6f7c6b',
										},
									}}
								>
									Reset all filters
								</Button>

								{/* SEARCH BUTTON */}
								<Button
									startIcon={<img src="/img/icons/search.svg" alt="Search icon" style={{ width: 20, height: 20 }} />}
									onClick={pushSearchHandler}
									variant="primary"
									sx={{
										borderRadius: '30px',
										paddingX: 4,
										paddingY: 1.5,
										fontWeight: 700,
										fontSize: '18px',
										textTransform: 'none',
										bgcolor: '#d4af37', // deep gold
										color: '#1a1a1a',
										boxShadow: '0 4px 10px rgba(212, 175, 55, 0.4)',
										'&:hover': {
											bgcolor: '#b28e1f', // darker gold
											boxShadow: '0 6px 12px rgba(178, 142, 31, 0.7)',
										},
									}}
								>
									Search
								</Button>
							</section>
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
				end: 20000000,
			},
			dateRange: {
				start: 2020,
				end: new Date().getFullYear(),
			},
		},
	},
};

export default HeaderFilter;
