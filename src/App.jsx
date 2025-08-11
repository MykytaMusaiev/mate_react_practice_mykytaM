/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const usersMap = usersFromServer.reduce((acc, curr) => {
  return { ...acc, [curr.id]: curr };
}, {});

const categoriesMap = categoriesFromServer.reduce((acc, curr) => {
  return { ...acc, [curr.id]: curr };
}, {});

const products = productsFromServer.map(product => {
  const category = categoriesMap[product.categoryId] || null;
  const user = usersMap[category?.ownerId] || null;

  return { ...product, category, user };
});

export const App = () => {
  const [filterByName, setFilterByName] = useState('All');
  const [filterByQuery, setFilterByQuery] = useState('');
  const [filterByCat, setFilterByCat] = useState([]);
  // const [tableSort, settableSort] = useState({ field: null, order: 'asc' });

  const handleNameClick = userName => {
    setFilterByName(userName);
  };

  const handleChange = e => {
    setFilterByQuery(e.currentTarget.value);
  };

  const handleInputClear = () => {
    setFilterByQuery('');
  };

  const handleCatClear = () => {
    setFilterByCat([]);
  };

  const handleCategories = categorie => {
    if (filterByCat.includes(categorie)) {
      setFilterByCat(filterByCat.filter(item => item !== categorie));
    } else {
      setFilterByCat(prevCat => [...prevCat, categorie]);
    }
  };

  const handleFilterReser = () => {
    setFilterByName('All');
    setFilterByQuery('');
    setFilterByCat([]);
  };

  // const handleTableSort = (e) => {

  // }

  const filteredProducts = products.filter(product => {
    const matchesUser =
      filterByName === 'All' || product.user.name === filterByName;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(filterByQuery.toLowerCase());

    const matchesCat =
      filterByCat.length === 0 || filterByCat.includes(product.category.title);

    return matchesUser && matchesSearch && matchesCat;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => handleNameClick('All')}
                className={cn({ 'is-active': filterByName === 'All' })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  className={cn(
                    { 'has-text-link': user.sex === 'm' },
                    { 'has-text-danger': user.sex === 'f' },
                    { 'is-active': filterByName === user.name },
                  )}
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => handleNameClick(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={filterByQuery}
                  onChange={e => handleChange(e)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {filterByQuery && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleInputClear}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', 'is-success', 'mr-6', {
                  'is-outlined': filterByCat.length > 0,
                })}
                onClick={handleCatClear}
              >
                All
              </a>
              {categoriesFromServer.map(categorie => (
                <a
                  key={categorie.id}
                  data-cy="Category"
                  className={cn('button', 'mr-2', 'my-1', {
                    'is-info': filterByCat.includes(categorie.title),
                  })}
                  href="#/"
                  onClick={() => handleCategories(categorie.title)}
                >
                  {categorie.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleFilterReser}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={cn(
                        { 'has-text-link': product.user.sex === 'm' },
                        { 'has-text-danger': product.user.sex === 'f' },
                      )}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="has-text-centered"
                    data-cy="NoMatchingMessage"
                  >
                    No products matching selected criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
