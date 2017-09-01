package com.taikor.investment.adapter;

import android.content.Context;
import android.util.SparseBooleanArray;
import android.view.View;
import android.widget.CheckBox;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Product;

import java.util.ArrayList;

/**
 * 智能投顾，自定义，添加产品中产品列表适配器
 * Created by Any on 2017/4/14.
 */
public class ProductAdapter extends ListBaseAdapter<Product> {

    private SparseBooleanArray mSelectedPositions = new SparseBooleanArray();

    public ProductAdapter(Context context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_product;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        TextView id = holder.getView(R.id.tv_product_id);
        id.setText(mDataList.get(position).getProductID());

        TextView name = holder.getView(R.id.tv_name);
        name.setText(mDataList.get(position).getProductName());

        CheckBox add = holder.getView(R.id.cb_add);
        add.setChecked(isItemChecked(position));
        add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isItemChecked(position)) {
                    setItemChecked(position, false);

                } else {
                    setItemChecked(position, true);
                }
            }
        });
    }

    //获得选中条目的结果
    public ArrayList<Product> getSelectedItem() {
        ArrayList<Product> selectList = new ArrayList<>();
        if (mDataList != null) {
            for (int i = 0; i < mDataList.size(); i++) {
                if (isItemChecked(i)) {
                    selectList.add(mDataList.get(i));
                }
            }
        }
        return selectList;
    }

    //设置给定位置条目的选择状态
    private void setItemChecked(int position, boolean isChecked) {
        mSelectedPositions.put(position, isChecked);
    }

    //根据位置判断条目是否选中
    private boolean isItemChecked(int position) {
        return mSelectedPositions.get(position);
    }

}
