package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.ContextCompat;
import android.util.SparseBooleanArray;
import android.view.View;
import android.widget.CheckBox;
import android.widget.ImageButton;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Block;
import com.taikor.investment.bean.Product;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

import java.util.ArrayList;

/**
 * 搜索个股
 * Created by Any on 2017/9/5.
 */

public class SearchStockAdapter extends ListBaseAdapter<Stock> {

    private boolean isShow = false;
    private SparseBooleanArray mSelectedPositions = new SparseBooleanArray();

    public SearchStockAdapter(Context context) {
        super(context);
    }

    public void setShow(boolean isShow) {
        this.isShow = isShow;
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_search;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        TextView name = holder.getView(R.id.search_name);
        name.setText(mDataList.get(position).getName());

        TextView price = holder.getView(R.id.search_price);
        double settlement = mDataList.get(position).getTrade();

        TextView percent = holder.getView(R.id.search_percent);
        double changePercent = mDataList.get(position).getChangepercent();
        if (changePercent > 0) {
            percent.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            percent.setText("+" + CommonUtils.setDoubleTwo(changePercent) + "%");

            price.setTextColor(ContextCompat.getColor(mContext, R.color.up));
        } else if (changePercent < 0) {
            percent.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            percent.setText("-" + CommonUtils.setDoubleTwo(changePercent) + "%");

            price.setTextColor(ContextCompat.getColor(mContext, R.color.down));
        } else {
            percent.setText("0.00%");
        }
        price.setText(CommonUtils.setDoubleTwo(settlement));

        CheckBox add = holder.getView(R.id.cb_add);
        if (isShow) {
            add.setVisibility(View.VISIBLE);
        }

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

//        holder.itemView.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                Intent intent = new Intent(mContext, GeneralDescActivity.class);
//                intent.putExtra("itemId", mDataList.get(position).getSymbol());
//                intent.putExtra("fromPage", "stock");
//                mContext.startActivity(intent);
//            }
//        });

    }

    //获得选中条目的结果
    public ArrayList<Stock> getSelectedItem() {
        ArrayList<Stock> selectList = new ArrayList<>();
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
