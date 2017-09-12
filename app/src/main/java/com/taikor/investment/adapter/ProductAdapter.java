package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.ContextCompat;
import android.util.SparseBooleanArray;
import android.view.View;
import android.widget.CheckBox;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Product;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

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
        return R.layout.item_option_fund;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        TextView name = holder.getView(R.id.search_name);
        name.setText(mDataList.get(position).getProductName());

        TextView netFit = holder.getView(R.id.search_price);
        TextView rateView = holder.getView(R.id.search_percent);

        double rate = mDataList.get(position).getAnnualizedProfitRate();
        if (rate > 0) {
            rateView.setTextColor(ContextCompat.getColor(mContext, R.color.up));
        } else if (rate < 0) {
            rateView.setTextColor(ContextCompat.getColor(mContext, R.color.down));
        }

        rateView.setText(CommonUtils.setDoubleTwo(rate));

        netFit.setText(CommonUtils.setDoubleFour(mDataList.get(position).getUnitNet()));

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

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId", mDataList.get(position).getProductID());
                intent.putExtra("fromPage", "fund");
                mContext.startActivity(intent);
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
