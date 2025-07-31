import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Typography
} from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { useRouter } from 'next/router';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Product } from '../../libs/types/product/product';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction } from '../../libs/enums/common.enum';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { useQuery } from '@apollo/client';
import ProductCard from '../../libs/components/product/ProductCard';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common']))
  }
});

const ProductList: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();

  const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
    router?.query?.input
      ? JSON.parse(router?.query?.input as string)
      : initialInput
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortingOpen, setSortingOpen] = useState(false);
  const [filterSortName, setFilterSortName] = useState('Recommendations');

  const { refetch } = useQuery(GET_PRODUCTS, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setProducts(data?.getProducts?.list || []);
      setTotal(data?.getProducts?.metaCounter[0]?.total || 0);
    }
  });

  /** Sync router + refetch products when searchFilter changes **/
  useEffect(() => {
    router.push(
      `/product?input=${encodeURIComponent(JSON.stringify(searchFilter))}`,
      undefined,
      { scroll: false }
    );
    refetch({ input: searchFilter });
  }, [searchFilter]);

  const handlePaginationChange = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    const updatedFilter = { ...searchFilter, page: value };
    setSearchFilter(updatedFilter);
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
      case 'recommendations':
        updatedFilter.sort = 'createdAt';
        updatedFilter.direction = Direction.DESC;
        setFilterSortName('Recommendations');
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

  if (device === 'mobile') return <h1>PRODUCTS MOBILE</h1>;

  return (
    <div id="product-list-page">
      <div className="container">
        {/* Filter + Sort Row */}
        <Box className="filter-top-bar">
          <span className="filter-label">
            <i className="fa-solid fa-sliders" /> Filter By:
          </span>
          <Filter
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            initialInput={initialInput}
          />
          <Box className="sort-box">
            <span>
              <i className="fa-solid fa-sort-amount-down" /> Sort By:
            </span>{' '}
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
              <MenuItem
                onClick={sortingHandler}
                id={'recommendations'}
                disableRipple
              >
                Recommendations
              </MenuItem>
              <MenuItem onClick={sortingHandler} id={'lowest'} disableRipple>
                Lowest Price
              </MenuItem>
              <MenuItem onClick={sortingHandler} id={'highest'} disableRipple>
                Highest Price
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Product List */}
        <Stack className="product-page">
          <Stack className="main-config">
            <Stack className="list-config">
              {products.length === 0 ? (
                <div className="no-data">No Products Found! ✨</div>
              ) : (
                products.map((product: Product) => (
                  <ProductCard
                    product={product}
                    likeProductHandler={() => {}}
                    key={product._id}
                  />
                ))
              )}
            </Stack>

            {/* Pagination */}
            {products.length > 0 && (
              <Stack className="pagination-config">
                <Pagination
                  page={currentPage}
                  count={Math.ceil(total / searchFilter.limit)}
                  onChange={handlePaginationChange}
                  shape="rounded"
                />
                <Typography className="total-result">
                  Showing {products.length} of {total}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

ProductList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    sort: 'createdAt',
    direction: 'DESC',
    search: { pricesRange: { start: 0, end: 2000000 } }
  }
};

export default withLayoutBasic(ProductList);
