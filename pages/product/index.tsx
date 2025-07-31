import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, IconButton, Menu, MenuItem, Pagination, Stack, Tooltip, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { useRouter } from 'next/router';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Product } from '../../libs/types/product/product';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../libs/types/common';
import { CREATE_ORDER, LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import ProductCard from '../../libs/components/product/ProductCard';
  import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import OutlinedInput from '@mui/material/OutlinedInput';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'next-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProductList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();

	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');
	const [searchText, setSearchText] = useState<string>("");
	const [showMore, setShowMore] = useState<boolean>(false);
		
	

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProducts(data?.getProducts?.list);
			setTotal(data?.getProducts?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const updatedInput = router?.query?.input
			? JSON.parse(router?.query?.input as string)
			: { ...initialInput };

		

		setSearchFilter(updatedInput);
		setCurrentPage(updatedInput.page ?? 1);
		getProductsRefetch({ input: updatedInput });
	}, [router.query]);

	useEffect(() => {
		console.log('searchFilter:', searchFilter);
	}, [searchFilter]);

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
	const refreshHandler = async () => {
		try {
		  setSearchText("");
		  setShowMore(false);
		  setSearchFilter(initialInput);
		  await router.push(
			`/product?input=${JSON.stringify(initialInput)}`,
			`/product?input=${JSON.stringify(initialInput)}`,
			{ scroll: false }
		  );
		} catch (err: any) {
		  console.log("ERROR, refreshHandler:", err);
		}
	  };
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);
			await likeTargetProduct({ variables: { input: id } });
			await getProductsRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR on likeProductHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		const updatedFilter = { ...searchFilter, page: value };
		setSearchFilter(updatedFilter);
		await router.push(`/product?input=${JSON.stringify(updatedFilter)}`, undefined, { scroll: false });
		setCurrentPage(value);
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		let updatedFilter = { ...searchFilter };
		switch (e.currentTarget.id) {
			case 'new':
				updatedFilter.sort = 'createdAt';
				updatedFilter.direction = Direction.ASC;
				setFilterSortName('New');
				break;
			case 'lowest':
				updatedFilter.sort = 'productPrice';
				updatedFilter.direction = Direction.ASC;
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				updatedFilter.sort = 'productPrice';
				updatedFilter.direction = Direction.DESC;
				setFilterSortName('Highest Price');
				break;
		}
		setSearchFilter(updatedFilter);
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>PRODUCTS MOBILE</h1>;
	} else {
		return (
			<div id="product-list-page" style={{ position: "relative" }}>
			  <div className="container">
				{/* Top Row: Search & Sort */}
				<Box className="top-row">
				  <Stack className={"search-box"}>
					<Stack className={"input-box"}>
					  <OutlinedInput
						value={searchText}
						type={"text"}
						className={"search-input"}
						placeholder={"What are you looking for?"}
						onChange={(e: any) => setSearchText(e.target.value)}
						onKeyDown={(event: any) => {
						  if (event.key == "Enter") {
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
								setSearchText("");
								setSearchFilter({
								  ...searchFilter,
								  search: { ...searchFilter.search, text: "" },
								});
							  }}
							/>
						  </>
						}
					  />
					  <img src={"/img/icons/search_icon.png"} alt={""} />
					  <Tooltip title="Reset" style={{ marginTop: "-40px", marginLeft: "300px" }}>
						<IconButton onClick={refreshHandler}>
						  <RefreshIcon  />
						</IconButton>
					  </Tooltip>
					</Stack>
				  </Stack>
		
				  <Box className={"right"}>
					<span>Sort by</span>
					<div>
					  <Button
						onClick={sortingClickHandler}
						endIcon={<KeyboardArrowDownRoundedIcon />}
					  >
						{filterSortName}
					  </Button>
					  <Menu
						anchorEl={anchorEl}
						open={sortingOpen}
						onClose={sortingCloseHandler}
					  >
						<MenuItem onClick={sortingHandler} id={"new"} disableRipple>
						  New
						</MenuItem>
						<MenuItem onClick={sortingHandler} id={"lowest"} disableRipple>
						  Lowest Price
						</MenuItem>
						<MenuItem onClick={sortingHandler} id={"highest"} disableRipple>
						  Highest Price
						</MenuItem>
					  </Menu>
					</div>
				  </Box>
				</Box>
		
				{/* Filter Row */}
				<Box className={"filter-row"}>
				  <Filter
					searchFilter={searchFilter}
					setSearchFilter={setSearchFilter}
					initialInput={initialInput}
				  />
				</Box>
		
				{/* Product Page */}
				<Stack className={"product-page"}>
				  <Stack className="main-config">
					<Stack className={"list-config"}>
					  {products?.length === 0 ? (
						<div className={"no-data"}>
						  <img src="/img/icons/icoAlert.svg" alt="" />
						  <p>No Products found!</p>
						</div>
					  ) : (
						products.map((product: Product) => (
						  <ProductCard
							product={product}
							likeProductHandler={likeProductHandler}
							key={product._id}
						  />
						))
					  )}
					</Stack>
		
					<Stack className="pagination-config">
					  {products.length !== 0 && (
						<Stack className="pagination-box">
						  <Pagination
							page={currentPage}
							count={Math.ceil(total / searchFilter.limit)}
							onChange={handlePaginationChange}
							shape="circular"
							color="primary"
						  />
						</Stack>
					  )}
		
					  {products.length !== 0 && (
						<Stack className="total-result">
						  <Typography>
							Total {total} product{total > 1 ? "s" : ""} available
						  </Typography>
						</Stack>
					  )}
					</Stack>
				  </Stack>
				</Stack>
			  </div>
			</div>
		  );
	}
};

ProductList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(ProductList);


