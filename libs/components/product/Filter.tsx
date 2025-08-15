import React, { useEffect, useState } from 'react';
import { Stack, Typography, Checkbox, FormControlLabel, Slider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCategory, ProductGender, ProductLocation, ProductMaterial } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

type FilterKey = 'locationList' | 'categoryList' | 'materialList' | 'genderList' | 'options';

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const [locations] = useState<ProductLocation[]>(Object.values(ProductLocation));
	const [categories] = useState<ProductCategory[]>(Object.values(ProductCategory));
	const [materials] = useState<ProductMaterial[]>(Object.values(ProductMaterial));
	const [genders] = useState<ProductGender[]>(Object.values(ProductGender));
	const [openFilter, setOpenFilter] = useState<string | null>(null);
	const [searchText, setSearchText] = useState('');

	const friendlyNames: Record<string, string> = {
		productLimited: 'Limited Edition',
		productBarter: 'Barter',
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			const cleanedSearch = { ...searchFilter.search };
			(Object.keys(cleanedSearch) as (keyof typeof cleanedSearch)[]).forEach((key) => {
				const value = cleanedSearch[key];
				
				if (Array.isArray(value) && value.length === 0) {
				  delete cleanedSearch[key];
				}
			  });
			  

			router.replace(
				{
					pathname: '/product',
					query: {
						input: JSON.stringify({ ...searchFilter, search: cleanedSearch }),
					},
				},
				undefined,
				{ scroll: false, shallow: true },
			);
		}, 400);

		return () => clearTimeout(handler);
	}, [searchFilter]);

	const toggleFilter = (filterName: string) => {
		setOpenFilter((prev) => (prev === filterName ? null : filterName));
	};

	const updateFilterList = (key: FilterKey, value: string) => {
		setSearchFilter((prev: ProductsInquiry) => {
			const currentList = prev?.search?.[key] || [];
			const isSelected = currentList.includes(value);

			return {
				...prev,
				search: {
					...prev.search,
					[key]: isSelected ? currentList.filter((item: string) => item !== value) : [...currentList, value],
				},
			};
		});
	};

	const productOptionSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchFilter((prev: ProductsInquiry) => {
			const currentList = prev?.search?.options || [];
			const isSelected = currentList.includes(value);

			return {
				...prev,
				search: {
					...prev.search,
					options: isSelected ? currentList.filter((item) => item !== value) : [...currentList, value],
				},
			};
		});
	};

	const productPriceHandler = (start: number, end: number) => {
		setSearchFilter((prev: ProductsInquiry) => ({
			...prev,
			search: {
				...prev.search,
				pricesRange: { start, end },
			},
		}));
	};

	const selectedFilters = [
		...(searchFilter?.search?.locationList || []).map((f: string) => ({
			type: 'locationList' as FilterKey,
			label: f,
		})),
		...(searchFilter?.search?.categoryList || []).map((f: string) => ({
			type: 'categoryList' as FilterKey,
			label: f,
		})),
		...(searchFilter?.search?.materialList || []).map((f: string) => ({
			type: 'materialList' as FilterKey,
			label: f,
		})),
		...(searchFilter?.search?.genderList || []).map((f: string) => ({
			type: 'genderList' as FilterKey,
			label: f,
		})),
		...(searchFilter?.search?.options || []).map((f: string) => ({
			type: 'options' as FilterKey,
			label: f,
		})),
		...(searchFilter?.search?.text
			? [
					{
						type: 'text' as FilterKey,
						label: searchFilter.search.text,
					},
			  ]
			: []),
	];

	const removeFilterChip = (type: keyof ProductsInquiry['search'], value: string) => {
		setSearchFilter((prev: ProductsInquiry) => {
			if (type === 'text') {
				const { text, ...rest } = prev.search;
				return { ...prev, search: rest };
			}

			const list = prev.search[type] as string[] | undefined;
			if (!list) return prev;

			return {
				...prev,
				search: {
					...prev.search,
					[type]: list.filter((v) => v !== value),
				},
			};
		});
	};

	const clearAllFilters = () => {
		setSearchFilter({
			...initialInput,
			search: {
				text: searchFilter.search?.text || '',
			},
		});
		setSearchText('');
	};

	if (device === 'mobile') {
		return <div>PRODUCTS FILTER</div>;
	}

	return (
		<Stack className="filter-main">
			{/* LOCATION */}
			<div
				className={`filter-box ${openFilter === 'location' ? 'active' : ''}`}
				onClick={() => toggleFilter('location')}
			>
				<Typography className="title">Location</Typography>
				<KeyboardArrowDownRoundedIcon className="dropdown-icon" />
				{openFilter === 'location' && (
					<div className="filter-overlay">
						<div className="filter-header">
							<h4>Select Location</h4>
							<CloseIcon onClick={() => setOpenFilter(null)} />
						</div>
						<div className="filter-content">
							{locations.map((location) => (
								<FormControlLabel
									key={location}
									control={
										<Checkbox
											checked={searchFilter?.search?.locationList?.includes(location)}
											onChange={() => updateFilterList('locationList', location)}
										/>
									}
									label={location}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* CATEGORY */}
			<div
				className={`filter-box ${openFilter === 'category' ? 'active' : ''}`}
				onClick={() => toggleFilter('category')}
			>
				<Typography className="title">Category</Typography>
				<KeyboardArrowDownRoundedIcon className="dropdown-icon" />
				{openFilter === 'category' && (
					<div className="filter-overlay">
						<div className="filter-header">
							<h4>Select Category</h4>
							<CloseIcon onClick={() => setOpenFilter(null)} />
						</div>
						<div className="filter-content">
							{categories.map((category) => (
								<FormControlLabel
									key={category}
									control={
										<Checkbox
											checked={searchFilter?.search?.categoryList?.includes(category)}
											onChange={() => updateFilterList('categoryList', category)}
										/>
									}
									label={category}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* MATERIAL */}
			<div
				className={`filter-box ${openFilter === 'material' ? 'active' : ''}`}
				onClick={() => toggleFilter('material')}
			>
				<Typography className="title">Material</Typography>
				<KeyboardArrowDownRoundedIcon className="dropdown-icon" />
				{openFilter === 'material' && (
					<div className="filter-overlay">
						<div className="filter-header">
							<h4>Select Material</h4>
							<CloseIcon onClick={() => setOpenFilter(null)} />
						</div>
						<div className="filter-content">
							{materials.map((material) => (
								<FormControlLabel
									key={material}
									control={
										<Checkbox
											checked={searchFilter?.search?.materialList?.includes(material)}
											onChange={() => updateFilterList('materialList', material)}
										/>
									}
									label={material}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* GENDER */}
			<div className={`filter-box ${openFilter === 'gender' ? 'active' : ''}`} onClick={() => toggleFilter('gender')}>
				<Typography className="title">Gender</Typography>
				<KeyboardArrowDownRoundedIcon className="dropdown-icon" />
				{openFilter === 'gender' && (
					<div className="filter-overlay">
						<div className="filter-header">
							<h4>Select Gender</h4>
							<CloseIcon onClick={() => setOpenFilter(null)} />
						</div>
						<div className="filter-content">
							{genders.map((gender) => (
								<FormControlLabel
									key={gender}
									control={
										<Checkbox
											checked={searchFilter?.search?.genderList?.includes(gender)}
											onChange={() => updateFilterList('genderList', gender)}
										/>
									}
									label={gender}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* OPTIONS (Limited, Barter) */}
			<div className={`filter-box ${openFilter === 'options' ? 'active' : ''}`} onClick={() => toggleFilter('options')}>
				<Typography className="title">Options</Typography>
				<KeyboardArrowDownRoundedIcon className="dropdown-icon" />
				{openFilter === 'options' && (
					<div className="filter-overlay">
						<div className="filter-header">
							<h4>Select Options</h4>
							<CloseIcon onClick={() => setOpenFilter(null)} />
						</div>
						<div className="filter-content">
							{Object.keys(friendlyNames).map((option) => (
								<FormControlLabel
									key={option}
									control={
										<Checkbox
											checked={searchFilter?.search?.options?.includes(option)}
											value={option}
											onChange={productOptionSelectHandler}
										/>
									}
									label={friendlyNames[option]}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* PRICE RANGE */}
			<div className={`filter-box ${openFilter === 'price' ? 'active' : ''}`}>
				<Typography className="title" onClick={() => toggleFilter('price')} style={{ cursor: 'pointer' }}>
					Price
				</Typography>
				<KeyboardArrowDownRoundedIcon
					className="dropdown-icon"
					onClick={() => toggleFilter('price')}
					style={{ cursor: 'pointer' }}
				/>

				{openFilter === 'price' && (
					<div className="filter-overlay price-range">
						<div className="filter-header">
							<h4>Select Price Range</h4>
							<CloseIcon onClick={() => setOpenFilter(null)} style={{ cursor: 'pointer' }} />
						</div>

						<div className="filter-content" style={{ width: '100%' }}>
							{/* SLIDER */}
							<Slider
  value={[
    searchFilter?.search?.pricesRange?.start || 0,
    searchFilter?.search?.pricesRange?.end || 20000000,
  ]}
  min={0}
  max={20000000}
  step={null}
  marks={[
    { value: 0, label: '₩0' },
    { value: 5000000, label: '₩5M' },
    { value: 10000000, label: '₩10M' },
    { value: 20000000, label: '₩20M' },
  ]}
  onChange={(e: any, newValue: any) => {
    if (Array.isArray(newValue)) {
      const [start, end] = newValue;
      productPriceHandler(start, end);
    }
  }}
  valueLabelDisplay="auto"
  sx={{
    width: '90%',
    margin: '0 auto',
    color: '#d4b483',
    '& .MuiSlider-thumb': {
      borderRadius: '50%',
      width: 20,
      height: 20,
      backgroundColor: '#fff',
      border: '2px solid #d4b483',
    },
    '& .MuiSlider-valueLabel': {
      backgroundColor: '#2e2424',
      borderRadius: '6px',
    },
  }}
/>

							{/* INPUT FIELDS */}
							<div
								className="price-inputs"
								style={{
									display: 'flex',
									justifyContent: 'center',
									marginTop: '12px',
									gap: '8px',
								}}
								onClick={(e) => e.stopPropagation()}
							>
								<input
									type="number"
									min={0}
									max={20000000}
									value={searchFilter?.search?.pricesRange?.start || 0}
									onChange={(e) => {
										const value = Math.min(20000000, Math.max(0, Number(e.target.value)));
										productPriceHandler(value, searchFilter?.search?.pricesRange?.end || 20000000);
									}}
									className="price-field"
									placeholder="Min ₩"
									style={{
										width: '50%',
										textAlign: 'center',
										padding: '8px',
										border: '1px solid #d4b483',
										borderRadius: '6px',
										fontSize: '16px',
									}}
								/>
								<span className="separator" style={{ alignSelf: 'center' }}>
									{' '}
									-{' '}
								</span>
								<input
									type="number"
									min={0}
									max={20000000}
									value={searchFilter?.search?.pricesRange?.end || 20000000}
									onChange={(e) => {
										const value = Math.min(20000000, Math.max(0, Number(e.target.value)));
										productPriceHandler(searchFilter?.search?.pricesRange?.start || 0, value);
									}}
									className="price-field"
									placeholder="Max ₩"
									style={{
										width: '50%',
										textAlign: 'center',
										padding: '8px',
										border: '1px solid #d4b483',
										borderRadius: '6px',
										fontSize: '16px',
									}}
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Selected Filter Chips */}
			{selectedFilters.length > 0 && (
				<div className="filter-history">
					<div className="chip-list">
						{selectedFilters.map((chip) => (
							<div key={`${chip.type}-${chip.label}`} className="chip-wrapper">
								<div className="chip" onClick={() => removeFilterChip(chip.type, chip.label)}>
									{friendlyNames[chip.label] || chip.label}
									<span>×</span>
								</div>
							</div>
						))}
					</div>

					{selectedFilters.length > 0 && (
						<div className="clear-all" onClick={clearAllFilters}>
							<img src="/img/icons/clear-all.png" alt="Clear All" />
						</div>
					)}
				</div>
			)}
		</Stack>
	);
};

export default Filter;
