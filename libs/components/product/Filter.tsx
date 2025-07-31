import React, { useCallback, useEffect, useState } from "react";
import {
  Stack,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import {
  ProductCategory,
  ProductGender,
  ProductLocation,
  ProductMaterial,
} from "../../enums/product.enum";
import { ProductsInquiry } from "../../types/product/product.input";
import { useRouter } from "next/router";

interface FilterType {
  searchFilter: ProductsInquiry;
  setSearchFilter: any;
  initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
  const { searchFilter, setSearchFilter, initialInput } = props;
  const device = useDeviceDetect();
  const router = useRouter();

  const [locations, setLocations] = useState<ProductLocation[]>(
    Object.values(ProductLocation)
  );
  const [categories, setCategories] = useState<ProductCategory[]>(
    Object.values(ProductCategory)
  );

  const [showMore, setShowMore] = useState<boolean>(false);

  /** LIFECYCLES **/
	useEffect(() => {
		  if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router
			  .push(
				`/product?input=${JSON.stringify({
				  ...searchFilter,
				  search: {
					...searchFilter.search,
				  },
				})}`,
				`/product?input=${JSON.stringify({
				  ...searchFilter,
				  search: {
					...searchFilter.search,
				  },
				})}`,
				{ scroll: false }
			  )
			  .then();
		  }
	  
		  if (searchFilter?.search?.categoryList?.length == 0) {
			delete searchFilter.search.categoryList;
			router
			  .push(
				`/product?input=${JSON.stringify({
				  ...searchFilter,
				  search: {
					...searchFilter.search,
				  },
				})}`,
				`/product?input=${JSON.stringify({
				  ...searchFilter,
				  search: {
					...searchFilter.search,
				  },
				})}`,
				{ scroll: false }
			  )
			  .then();
		  }
	  
		  if (searchFilter?.search?.materialList?.length == 0) {
			delete searchFilter.search.materialList;
			router
			  .push(
				`/product?input=${JSON.stringify({
				  ...searchFilter,
				  search: {
					...searchFilter.search,
				  },
				})}`,
				`/product?input=${JSON.stringify({
				  ...searchFilter,
				  search: {
					...searchFilter.search,
				  },
				})}`,
				{ scroll: false }
			  )
			  .then();
		  }
	  
		  if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router
			  .push(
				`/product?input=${JSON.stringify({
				  ...searchFilter,
				  search: {
					...searchFilter.search,
				  },
				})}`,
				`/product?input=${JSON.stringify({
				  ...searchFilter,
				  search: {
					...searchFilter.search,
				  },
				})}`,
				{ scroll: false }
			  )
			  .then();
		  }
	  
		  if (searchFilter?.search?.genderList?.length == 0) {
			delete searchFilter.search.genderList;
			router
			  .push(
				`/product?input=${JSON.stringify({
				  ...searchFilter,
				  search: {
					...searchFilter.search,
				  },
				})}`,
				`/product?input=${JSON.stringify({
				  ...searchFilter,
				  search: {
					...searchFilter.search,
				  },
				})}`,
				{ scroll: false }
			  )
			  .then();
		  }
	  
		  if (searchFilter?.search?.locationList) setShowMore(true);
		}, [searchFilter]);

  /** HANDLERS **/
  const productLocationSelectHandler = useCallback(
    async (location: string) => {
      const currentList = searchFilter?.search?.locationList || [];
      const isSelected = currentList.includes(location as ProductLocation);

      const newLocationList = isSelected
        ? currentList.filter(item => item !== location)
        : [...currentList, location];

      const newSearchFilter = {
        ...searchFilter,
        search: {
          ...searchFilter.search,
          locationList: newLocationList,
        },
      };

      await router.push(
        `/product?input=${encodeURIComponent(JSON.stringify(newSearchFilter))}`,
        undefined,
        { scroll: false }
      );
    },
    [searchFilter, router]
  );

  const productCategorySelectHandler = useCallback(
    async (category: string) => {
      const currentList = searchFilter?.search?.categoryList || [];
      const isSelected = currentList.includes(category as ProductCategory);

      const newCategoryList = isSelected
        ? currentList.filter(item => item !== category)
        : [...currentList, category];

      const newSearchFilter = {
        ...searchFilter,
        search: {
          ...searchFilter.search,
          categoryList: newCategoryList,
        },
      };

      await router.push(
        `/product?input=${encodeURIComponent(JSON.stringify(newSearchFilter))}`,
        undefined,
        { scroll: false }
      );
    },
    [searchFilter, router]
  );

  const productMaterialSelectHandler = useCallback(
    (event: any) => {
      const value = event.target.value;
      setSearchFilter((prev: any) => ({
        ...prev,
        search: {
          ...prev.search,
          materialList: value ? [value] : [],
        },
      }));
    },
    [setSearchFilter]
  );

  const productGenderSelectHandler = useCallback(
    (event: any) => {
      const value = event.target.value;
      setSearchFilter((prev: any) => ({
        ...prev,
        search: {
          ...prev.search,
          genderList: value ? [value] : [],
        },
      }));
    },
    [setSearchFilter]
  );

  const productOptionSelectHandler = useCallback(
    async (option: string) => {
      const currentList = searchFilter?.search?.options || [];
      const isSelected = currentList.includes(option);

      const newOptionList = isSelected
        ? currentList.filter(item => item !== option)
        : [...currentList, option];

      const newSearchFilter = {
        ...searchFilter,
        search: {
          ...searchFilter.search,
          options: newOptionList,
        },
      };

      await router.push(
        `/product?input=${encodeURIComponent(JSON.stringify(newSearchFilter))}`,
        undefined,
        { scroll: false }
      );
    },
    [searchFilter, router]
  );

  const productPriceHandler = useCallback(
    async (value: number, type: string) => {
      const pricesRange = {
        ...searchFilter.search.pricesRange,
        [type]: value,
      };

      const newSearchFilter = {
        ...searchFilter,
        search: {
          ...searchFilter.search,
          pricesRange,
        },
      };

      await router.push(
        `/product?input=${encodeURIComponent(JSON.stringify(newSearchFilter))}`,
        undefined,
        { scroll: false }
      );
    },
    [searchFilter]
  );

  if (device === "mobile") {
    return <div>PRODUCTS FILTER</div>;
  }

  return (
    <Stack className="filter-main">
      {/* Location */}
      <Stack className="filter-box location" mb="30px">
        <Typography className="title">Location</Typography>
        <Stack className="product-location">
          {locations.map((location) => {
            const selected = (searchFilter?.search?.locationList || []).includes(location);
            return (
              <Stack
                key={location}
                onClick={() => productLocationSelectHandler(location)}
                sx={{
                  cursor: "pointer",
                  padding: "4px 8px",
                  fontWeight: selected ? "bold" : "normal",
                  color: selected ? "#181a20" : "#717171",
                  borderRadius: 1,
                  backgroundColor: selected ? "rgba(24, 26, 32, 0.1)" : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(24, 26, 32, 0.05)",
                  },
                }}
              >
                <Typography>{location}</Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      {/* Product Category */}
      <Stack className="filter-box category" mb="30px">
        <Typography className="title">Product Category</Typography>
        <Stack className="menu-items">
          {categories.map((category: string) => {
            const isSelected = searchFilter?.search?.categoryList?.includes(category as ProductCategory);
            return (
              <MenuItem
                key={category}
                value={category}
                selected={isSelected}
                onClick={() => productCategorySelectHandler(category)}
              >
                {category}
              </MenuItem>
            );
          })}
        </Stack>
      </Stack>

      {/* Jewelry Material */}
	  <Stack className="filter-box material" mb="30px">
  <Typography className="title">Jewelry Material</Typography>
  <div className="menu-items">
    {[
      { label: "Any", value: "" },
      { label: "Gold", value: ProductMaterial.GOLD },
      { label: "Diamond", value: ProductMaterial.DIAMOND },
      { label: "Silver", value: ProductMaterial.SILVER },
      { label: "Platinum", value: ProductMaterial.PLATINUM },
      { label: "Gemstone", value: ProductMaterial.GEMSTONE },
    ].map((item) => (
      <MenuItem
        key={item.value}
        selected={searchFilter?.search?.materialList?.[0] === item.value}
        onClick={() =>
          productMaterialSelectHandler({
            target: { value: item.value },
          })
        }
      >
        {item.label}
      </MenuItem>
    ))}
  </div>
</Stack>


      {/* Gender */}
	  <Stack className="filter-box gender" mb="30px">
  <Typography className="title">Gender</Typography>
  <Stack className="menu-items">
    {/* "Any" option */}
    <MenuItem
      value=""
      onClick={() => productGenderSelectHandler({ target: { value: "" } })}
      selected={!searchFilter?.search?.genderList?.[0]}
      sx={{
        fontWeight: !searchFilter?.search?.genderList?.[0] ? "bold" : "normal",
        cursor: "pointer",
      }}
    >
      Any
    </MenuItem>

    {/* Men */}
    <MenuItem
      value={ProductGender.MEN}
      onClick={() => productGenderSelectHandler({ target: { value: ProductGender.MEN } })}
      selected={searchFilter?.search?.genderList?.[0] === ProductGender.MEN}
      sx={{
        fontWeight: searchFilter?.search?.genderList?.[0] === ProductGender.MEN ? "bold" : "normal",
        cursor: "pointer",
      }}
    >
      Men
    </MenuItem>

    {/* Women */}
    <MenuItem
      value={ProductGender.WOMEN}
      onClick={() => productGenderSelectHandler({ target: { value: ProductGender.WOMEN } })}
      selected={searchFilter?.search?.genderList?.[0] === ProductGender.WOMEN}
      sx={{
        fontWeight: searchFilter?.search?.genderList?.[0] === ProductGender.WOMEN ? "bold" : "normal",
        cursor: "pointer",
      }}
    >
      Women
    </MenuItem>
  </Stack>
</Stack>


{/* Options */}
<Stack className="filter-box options" mb="30px">
  <Typography className="title">Options</Typography>
  <div className="menu-items">
  {['productBarter', 'productRent'].map((option) => {
    const selected = (searchFilter?.search?.options || []).includes(option);
    const label = option === "productBarter" ? "Barter" : "Rent";
    return (
      <Stack
        key={option}
        onClick={() => productOptionSelectHandler(option)}
      >
        <MenuItem>{label}</MenuItem>
      </Stack>
    );
  })}
  </div>
</Stack>


    {/* Price Range */}
<Stack className="filter-box price" mb="30px">
  <Typography className="title">Price Range</Typography>
  <div className="menu-items">
    <Stack className="square-year-input">
      <input
        type="number"
        placeholder="$ min"
        min={0}
        value={searchFilter?.search?.pricesRange?.start ?? 0}
        onChange={(e: any) => productPriceHandler(e.target.value, "start")}
      />
      <div className="central-divider" />
      <input
        type="number"
        placeholder="$ max"
        value={searchFilter?.search?.pricesRange?.end ?? 0}
        onChange={(e: any) => productPriceHandler(e.target.value, "end")}
      />
    </Stack>
  </div>
</Stack>

    </Stack>
  );
};

export default Filter;
