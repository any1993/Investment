package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.widget.CheckBox;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Block;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

/**
 * 搜索主题
 * Created by Any on 2017/9/5.
 */

public class SearchThemeAdapter extends ListBaseAdapter<Block> {

    private boolean isShow = false;

    public SearchThemeAdapter(Context context) {
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
        double settlement = mDataList.get(position).getSettlement();

        TextView percent = holder.getView(R.id.search_percent);
        double changePercent = mDataList.get(position).getChangePercent();
        if (changePercent > 0) {
            percent.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            percent.setText("+"+CommonUtils.setDoubleTwo(changePercent) + "%");

            price.setTextColor(ContextCompat.getColor(mContext, R.color.up));
        } else if (changePercent < 0) {
            percent.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            percent.setText("-"+CommonUtils.setDoubleTwo(changePercent) + "%");

            price.setTextColor(ContextCompat.getColor(mContext, R.color.down));
        } else {
            percent.setText("0.00%");
        }
        price.setText(CommonUtils.setDoubleTwo(settlement));

        CheckBox add = holder.getView(R.id.cb_add);
        if (isShow) {
            add.setVisibility(View.VISIBLE);
        }

        add.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId", mDataList.get(position).getID());
                intent.putExtra("fromPage","theme");
                mContext.startActivity(intent);
            }
        });
    }
}
