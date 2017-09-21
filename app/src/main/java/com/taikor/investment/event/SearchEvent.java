package com.taikor.investment.event;

import com.taikor.investment.bean.Product;
import com.taikor.investment.bean.Stock;

import java.util.ArrayList;

/**
 * Created by Any on 2017/9/8.
 */

public class SearchEvent {
    private ArrayList<Stock> stocks;
    private ArrayList<Product> products;

    public ArrayList<Stock> getStocks() {
        return stocks;
    }

    public void setStocks(ArrayList<Stock> stocks) {
        this.stocks = stocks;
    }

    public ArrayList<Product> getProducts() {
        return products;
    }

    public void setProducts(ArrayList<Product> products) {
        this.products = products;
    }
}
