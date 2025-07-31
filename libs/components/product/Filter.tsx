import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
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
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

type FilterKey =
  | "locationList"
  | "categoryList"
  | "materialList"
  | "genderList"
  | "options";

interface FilterType {
  searchFilter: ProductsInquiry;
  setSearchFilter: any;
  initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
  const { searchFilter, setSearchFilter } = props;
  const device = useDeviceDetect();
  const router = useRouter();

  const [locations] = useState<ProductLocation[]>(Object.values(ProductLocation));
  const [categories] = useState<ProductCategory[]>(Object.values(ProductCategory));
  const [materials] = useState<ProductMaterial[]>(Object.values(ProductMaterial));
  const [genders] = useState<ProductGender[]>(Object.values(ProductGender));
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const friendlyNames: Record<string, string> = {
    productRent: "Rent",
    productBarter: "Barter",
  };

  /** Watch for filter changes and update URL **/
  useEffect(() => {
    const handler = setTimeout(() => {
      const cleanedSearch = { ...searchFilter.search };
      (Object.keys(cleanedSearch) as (keyof typeof cleanedSearch)[]).forEach((key) => {
        if (Array.isArray(cleanedSearch[key]) && cleanedSearch[key]!.length === 0) {
          delete cleanedSearch[key];
        }
      });
  
      router.replace(
        {
          pathname: "/product",
          query: {
            input: JSON.stringify({ ...searchFilter, search: cleanedSearch }),
          },
        },
        undefined,
        { scroll: false, shallow: true } // ✅ shallow prevents full _next/data reload
      );
    }, 400);
  
    return () => clearTimeout(handler);
  }, [searchFilter]);
  

  /** Toggle dropdown filter box **/
  const toggleFilter = (filterName: string) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };

  /** Update checkbox filters **/
  const updateFilterList = (key: FilterKey, value: string) => {
    setSearchFilter((prev: ProductsInquiry) => {
      const currentList = prev?.search?.[key] || [];
      const isSelected = currentList.includes(value);

      return {
        ...prev,
        search: {
          ...prev.search,
          [key]: isSelected
            ? currentList.filter((item: string) => item !== value)
            : [...currentList, value],
        },
      };
    });
  };

  /** Update options (Rent/Barter) **/
  const productOptionSelectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchFilter((prev: ProductsInquiry) => {
      const currentList = prev?.search?.options || [];
      const isSelected = currentList.includes(value);

      return {
        ...prev,
        search: {
          ...prev.search,
          options: isSelected
            ? currentList.filter((item) => item !== value)
            : [...currentList, value],
        },
      };
    });
  };

  /** Price range update **/
  const productPriceHandler = (start: number, end: number) => {
    setSearchFilter((prev: ProductsInquiry) => ({
      ...prev,
      search: {
        ...prev.search,
        pricesRange: { start, end },
      },
    }));
  };

  /** Selected filters for chips **/
  const selectedFilters = [
    ...(searchFilter?.search?.locationList || []).map((f: string) => ({
      type: "locationList" as FilterKey,
      label: f,
    })),
    ...(searchFilter?.search?.categoryList || []).map((f: string) => ({
      type: "categoryList" as FilterKey,
      label: f,
    })),
    ...(searchFilter?.search?.materialList || []).map((f: string) => ({
      type: "materialList" as FilterKey,
      label: f,
    })),
    ...(searchFilter?.search?.genderList || []).map((f: string) => ({
      type: "genderList" as FilterKey,
      label: f,
    })),
    ...(searchFilter?.search?.options || []).map((f: string) => ({
      type: "options" as FilterKey,
      label: f,
    })),
  ];

  /** Remove selected filter chip **/
  const removeFilterChip = (
    type: keyof ProductsInquiry["search"],
    value: string
  ) => {
    setSearchFilter((prev: ProductsInquiry) => {
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

  if (device === "mobile") {
    return <div>PRODUCTS FILTER</div>;
  }

  return (
    <Stack className="filter-main">
      {/* LOCATION */}
      <div
        className={`filter-box ${openFilter === "location" ? "active" : ""}`}
        onClick={() => toggleFilter("location")}
      >
        <Typography className="title">Location</Typography>
        <KeyboardArrowDownRoundedIcon className="dropdown-icon" />
        {openFilter === "location" && (
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
                      onChange={() => updateFilterList("locationList", location)}
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
        className={`filter-box ${openFilter === "category" ? "active" : ""}`}
        onClick={() => toggleFilter("category")}
      >
        <Typography className="title">Category</Typography>
        <KeyboardArrowDownRoundedIcon className="dropdown-icon" />
        {openFilter === "category" && (
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
                      onChange={() => updateFilterList("categoryList", category)}
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
        className={`filter-box ${openFilter === "material" ? "active" : ""}`}
        onClick={() => toggleFilter("material")}
      >
        <Typography className="title">Material</Typography>
        <KeyboardArrowDownRoundedIcon className="dropdown-icon" />
        {openFilter === "material" && (
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
                      onChange={() => updateFilterList("materialList", material)}
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
      <div
        className={`filter-box ${openFilter === "gender" ? "active" : ""}`}
        onClick={() => toggleFilter("gender")}
      >
        <Typography className="title">Gender</Typography>
        <KeyboardArrowDownRoundedIcon className="dropdown-icon" />
        {openFilter === "gender" && (
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
                      onChange={() => updateFilterList("genderList", gender)}
                    />
                  }
                  label={gender}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* OPTIONS (Rent, Barter) */}
      <div
        className={`filter-box ${openFilter === "options" ? "active" : ""}`}
        onClick={() => toggleFilter("options")}
      >
        <Typography className="title">Options</Typography>
        <KeyboardArrowDownRoundedIcon className="dropdown-icon" />
        {openFilter === "options" && (
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
      <div
        className={`filter-box ${openFilter === "price" ? "active" : ""}`}
        onClick={() => toggleFilter("price")}
      >
        <Typography className="title">Price</Typography>
        <KeyboardArrowDownRoundedIcon className="dropdown-icon" />
        {openFilter === "price" && (
          <div className="filter-overlay">
            <div className="filter-header">
              <h4>Select Price Range</h4>
              <CloseIcon onClick={() => setOpenFilter(null)} />
            </div>
            <div className="filter-content">
            <Slider
  value={[
    searchFilter?.search?.pricesRange?.start || 0,
    searchFilter?.search?.pricesRange?.end || 2000000,
  ]}
  onChangeCommitted={(e: any, newValue: number[]) => {
    const [start, end] = newValue as number[];
    productPriceHandler(start, end);
  }}
  min={0}
  max={2000000}
  step={10000}
/>
            </div>
          </div>
        )}
      </div>

      {/* Selected Filter Chips */}
      {selectedFilters.length > 0 && (
        <div className="filter-history">
          {selectedFilters.map((chip) => (
            <div
              key={`${chip.type}-${chip.label}`}
              className="chip"
              onClick={() => removeFilterChip(chip.type, chip.label)}
            >
              {friendlyNames[chip.label] || chip.label}
              <span>×</span>
            </div>
          ))}
        </div>
      )}
    </Stack>
  );
};

export default Filter;
