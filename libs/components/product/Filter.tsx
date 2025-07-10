import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCategory, ProductGender, ProductLocation, ProductMaterial } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { productSize } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [locations, setLocations] = useState<ProductLocation[]>(Object.values(ProductLocation));
	const [categories, setCategories] = useState<ProductCategory[]>(Object.values(ProductCategory));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		const queryParams = JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		});

		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router.push(`/product?input=${queryParams}`, `/product?input=${queryParams}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.categoryList?.length == 0) {
			delete searchFilter.search.categoryList;
			router.push(`/product?input=${queryParams}`, `/product?input=${queryParams}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.materialList?.length == 0) {
			delete searchFilter.search.materialList;
			router.push(`/product?input=${queryParams}`, `/product?input=${queryParams}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router.push(`/product?input=${queryParams}`, `/product?input=${queryParams}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.genderList?.length == 0) {
			delete searchFilter.search.genderList;
			router.push(`/product?input=${queryParams}`, `/product?input=${queryParams}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const productLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.categoryList?.length == 0) {
					alert('error');
				}

				console.log('productLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, productLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productCategorySelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.categoryList || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.categoryList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.categoryList?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.categoryList?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.categoryList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.categoryList?.length == 0) {
					alert('error');
				}

				console.log('productCategorySelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, productCategorySelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productMaterialSelectHandler = useCallback(
		(selectedMaterial?: ProductMaterial) => {
			try {
				const currentList: ProductMaterial[] = searchFilter?.search?.materialList || [];

				let newMaterialList: ProductMaterial[] = [];

				if (!selectedMaterial) {
					// Clear all if "Any" clicked
					newMaterialList = [];
				} else {
					if (currentList.includes(selectedMaterial)) {
						// Remove if already selected
						newMaterialList = currentList.filter((item) => item !== selectedMaterial);
					} else {
						// Add it
						newMaterialList = [...currentList, selectedMaterial];
					}
				}

				const newFilter = {
					...searchFilter,
					search: {
						...searchFilter.search,
						// Only add if non-empty, else delete key
						...(newMaterialList.length > 0 ? { materialList: newMaterialList } : {}),
					},
				};

				setSearchFilter(newFilter);

				console.log('productMaterialSelectHandler:', newMaterialList);
			} catch (err) {
				console.error('ERROR in productMaterialSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('productOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, productOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productGenderSelectHandler = useCallback(
		(selectedGender?: ProductGender) => {
			const currentList: ProductGender[] = searchFilter?.search?.genderList || [];

			let newGenderList: ProductGender[] = [];

			if (!selectedGender) {
				// Clear
				newGenderList = [];
			} else {
				if (currentList.includes(selectedGender)) {
					newGenderList = currentList.filter((g) => g !== selectedGender);
				} else {
					newGenderList = [...currentList, selectedGender];
				}
			}

			const newFilter = {
				...searchFilter,
				search: {
					...searchFilter.search,
					...(newGenderList.length > 0 ? { genderList: newGenderList } : {}),
				},
			};

			setSearchFilter(newFilter);
			console.log('productGenderSelectHandler:', newGenderList);
		},
		[searchFilter],
	);

	const productSizeHandler = useCallback(
		(value: number) => {
			const newFilter = {
				...searchFilter,
				search: {
					...searchFilter.search,
					selectedSize: value || undefined,
				},
			};
			setSearchFilter(newFilter);
		},
		[searchFilter],
	);

	const productPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/product?input=${JSON.stringify(initialInput)}`,
				`/product?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCTS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Jewelry</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack
						className={`product-location`}
						style={{ height: showMore ? '253px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{locations.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="product-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as ProductLocation)}
										onChange={productLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="product-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Product Category</Typography>
					{categories.map((category: string) => (
						<Stack className={'input-box'} key={category}>
							<Checkbox
								id={category}
								className="product-checkbox"
								color="default"
								size="small"
								value={category}
								onChange={productCategorySelectHandler}
								checked={(searchFilter?.search?.categoryList || []).includes(category as ProductCategory)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="product_category">{category}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Jewelry</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '12px 0 0 12px',
								border:
									!searchFilter?.search?.materialList || searchFilter.search.materialList.length === 0
										? '2px solid #181A20'
										: '1px solid #b9b9b9',
							}}
							onClick={() => productMaterialSelectHandler(undefined)} // Clear filter
						>
							Any
						</Button>

						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.materialList?.includes(ProductMaterial.GOLD)
									? '2px solid #181A20'
									: '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.materialList?.includes(ProductMaterial.GOLD) ? undefined : 'none',
							}}
							onClick={() => productMaterialSelectHandler(ProductMaterial.GOLD)}
						>
							Gold
						</Button>

						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.materialList?.includes(ProductMaterial.DIAMOND)
									? '2px solid #181A20'
									: '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.materialList?.includes(ProductMaterial.DIAMOND) ? undefined : 'none',
							}}
							onClick={() => productMaterialSelectHandler(ProductMaterial.DIAMOND)}
						>
							Diamond
						</Button>

						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.materialList?.includes(ProductMaterial.SILVER)
									? '2px solid #181A20'
									: '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.materialList?.includes(ProductMaterial.SILVER) ? undefined : 'none',
							}}
							onClick={() => productMaterialSelectHandler(ProductMaterial.SILVER)}
						>
							Silver
						</Button>

						<Button
							sx={{
								borderRadius: 0,
								border: searchFilter?.search?.materialList?.includes(ProductMaterial.PLATINUM)
									? '2px solid #181A20'
									: '1px solid #b9b9b9',
								borderLeft: searchFilter?.search?.materialList?.includes(ProductMaterial.PLATINUM) ? undefined : 'none',
							}}
							onClick={() => productMaterialSelectHandler(ProductMaterial.PLATINUM)}
						>
							Platinum
						</Button>

						<Button
							sx={{
								borderRadius: '0 12px 12px 0',
								border: searchFilter?.search?.materialList?.includes(ProductMaterial.GEMSTONE)
									? '2px solid #181A20'
									: '1px solid #b9b9b9',
							}}
							onClick={() => productMaterialSelectHandler(ProductMaterial.GEMSTONE)}
						>
							Gemstone
						</Button>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Gender</Typography>
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Gender</Typography>
						<Stack className="button-group">
							<Button
								sx={{
									borderRadius: '12px 0 0 12px',
									border:
										!searchFilter?.search?.genderList || searchFilter.search.genderList.length === 0
											? '2px solid #181A20'
											: '1px solid #b9b9b9',
								}}
								onClick={() => productGenderSelectHandler(undefined)}
							>
								Any
							</Button>

							<Button
								sx={{
									borderRadius: 0,
									border: searchFilter?.search?.genderList?.includes(ProductGender.MEN)
										? '2px solid #181A20'
										: '1px solid #b9b9b9',
									...(searchFilter?.search?.genderList?.includes(ProductGender.MEN) ? {} : { borderLeft: 'none' }),
								}}
								onClick={() => productGenderSelectHandler(ProductGender.MEN)}
							>
								Men
							</Button>

							<Button
								sx={{
									borderRadius: '0 12px 12px 0',
									border: searchFilter?.search?.genderList?.includes(ProductGender.WOMEN)
										? '2px solid #181A20'
										: '1px solid #b9b9b9',
									...(searchFilter?.search?.genderList?.includes(ProductGender.WOMEN) ? {} : { borderLeft: 'none' }),
								}}
								onClick={() => productGenderSelectHandler(ProductGender.WOMEN)}
							>
								Women
							</Button>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Options</Typography>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Barter'}
							className="product-checkbox"
							color="default"
							size="small"
							value={'productBarter'}
							checked={(searchFilter?.search?.options || []).includes('productBarter')}
							onChange={productOptionSelectHandler}
						/>
						<label htmlFor={'Barter'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Barter</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Rent'}
							className="product-checkbox"
							color="default"
							size="small"
							value={'productRent'}
							checked={(searchFilter?.search?.options || []).includes('productRent')}
							onChange={productOptionSelectHandler}
						/>
						<label htmlFor={'Rent'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Rent</Typography>
						</label>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Product Size</Typography>
					<FormControl fullWidth>
						<InputLabel id="product-size-label">Size</InputLabel>
						<Select
							labelId="product-size-label"
							id="product-size-select"
							value={searchFilter?.search?.sizeList ?? ''}
							label="Size"
							onChange={(e) => productSizeHandler(Number(e.target.value))}
							MenuProps={MenuProps}
							
						>
							{productSize.map((size) => (
								<MenuItem key={size} value={size}>
									{size}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>

				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									productPriceHandler(e.target.value, 'start');
								}
							}}
							
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									productPriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
