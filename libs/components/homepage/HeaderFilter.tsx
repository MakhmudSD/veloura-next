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
					</Stack>

					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="" />
							<span>{t('Advanced')}</span>
						</Box>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
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

					{/* CATEGORY MENU — NOW SAME STRUCTURE */}
					<div className={`filter-category ${openCategory ? 'on' : ''}`} ref={categoryRef}>
						{productCategory.map((category) => (
							<div key={category} onClick={() => productCategorySelectHandler(category)}>
								<img src={`/img/banner/types/${category.toLowerCase()}.webp`} alt={category} />
								<span>{category}</span>
							</div>
						))}
					</div>

					{/* MATERIAL MENU — SAME STRUCTURE */}
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
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>

							<div className={'top'}>
								<span>Find your jewelry</span>
								<div className={'search-input-box'}>
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
									/>
								</div>
							</div>

							<Divider sx={{ mt: '30px', mb: '35px' }} />

							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>Gender</span>
										<div className={'inside'}>
											<div
												className={`room ${
													!searchFilter?.search?.genderList || searchFilter.search.genderList.length === 0
														? 'active'
														: ''
												}`}
												onClick={() => productGenderSelectHandler(null)}
											>
												Any
											</div>
											{Object.values(ProductGender).map((gender) => (
												<div
													key={gender}
													className={`room ${searchFilter?.search?.genderList?.includes(gender) ? 'active' : ''}`}
													onClick={() => productGenderSelectHandler(gender)}
												>
													{gender.charAt(0) + gender.slice(1).toLowerCase()}
												</div>
											))}
										</div>
									</div>

									<div className={'box'}>
										<span>Options</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={optionCheck}
													onChange={productOptionSelectHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value={'all'}>All Options</MenuItem>
													<MenuItem value={'productBarter'}>Barter</MenuItem>
													<MenuItem value={'productRent'}>Rent</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
								</div>

								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Year Built</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.start.toString()}
													onChange={yearStartChangeHandler}
													displayEmpty
													MenuProps={MenuProps}
												>
													{productYears.map((year) => (
														<MenuItem key={year} value={year} disabled={yearCheck.end <= year}>
															{year}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={yearCheck.end.toString()}
													onChange={yearEndChangeHandler}
													displayEmpty
													MenuProps={MenuProps}
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

									<div className={'box'}>
										<span>KRW</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.pricesRange?.start}
													onChange={(e) => productPriceRangeHandler(e, 'start')}
													displayEmpty
													MenuProps={MenuProps}
												>
													{productPrice.map((price) => (
														<MenuItem
															key={price}
															value={price}
															disabled={(searchFilter?.search?.pricesRange?.end || 0) < price}
														>
															{price}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.pricesRange?.end}
													onChange={(e) => productPriceRangeHandler(e, 'end')}
													displayEmpty
													MenuProps={MenuProps}
												>
													{productPrice.map((price) => (
														<MenuItem
															key={price}
															value={price}
															disabled={(searchFilter?.search?.pricesRange?.start || 0) > price}
														>
															{price}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>

							<Divider sx={{ mt: '60px', mb: '18px' }} />

							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
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
