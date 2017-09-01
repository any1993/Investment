package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.General;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

import java.util.List;

/**
 * 股票指数
 * Created by Any on 2017/8/10.
 */

public class StockIndexAdapter extends ListBaseAdapter<Stock> {
    private List<General> generalList;

    public StockIndexAdapter(Context context) {
        super(context);
    }

    public void setData(List<General> generalList) {
        this.generalList = generalList;
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_stock_index;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        if (position == 2) {
            holder.getView(R.id.divider).setVisibility(View.GONE);
        }

        TextView name = holder.getView(R.id.tv_index_name);
        name.setText(mDataList.get(position).getName());

        TextView trade = holder.getView(R.id.tv_index_open);

        TextView priceChange = holder.getView(R.id.tv_price_change);

        TextView changePercent = holder.getView(R.id.tv_change_percent);

        double percent = mDataList.get(position).getChangepercent();

        if (percent > 0) {
            trade.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            changePercent.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            changePercent.setText("+" + CommonUtils.setDoubleTwo(percent)+"%");

            priceChange.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            priceChange.setText("+" + CommonUtils.setDoubleTwo(mDataList.get(position).getPricechange()));

        } else if (percent < 0) {
            trade.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            changePercent.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            changePercent.setText("-" + CommonUtils.setDoubleTwo(percent)+"%");

            priceChange.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            priceChange.setText("-" + CommonUtils.setDoubleTwo(mDataList.get(position).getPricechange()));
        } else {
            trade.setTextColor(ContextCompat.getColor(mContext, R.color.text_color_3));
            changePercent.setTextColor(ContextCompat.getColor(mContext, R.color.text_color_3));
            changePercent.setText(CommonUtils.setDoubleTwo(percent)+"%");

            priceChange.setTextColor(ContextCompat.getColor(mContext, R.color.text_color_3));
            priceChange.setText(CommonUtils.setDoubleTwo(mDataList.get(position).getPricechange()));
        }

        trade.setText(CommonUtils.setDoubleTwo(mDataList.get(position).getTrade()));

        //股票指数详情
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId", String.valueOf(generalList.get(position).getPushDate()));

                int type = generalList.get(position).getType();
                switch (type) {
                    case 2:
                        intent.putExtra("fromPage", "morning");
                        break;
                    case 3:
                        intent.putExtra("fromPage", "noon");
                        break;
                    case 4:
                        intent.putExtra("fromPage", "afternoon");
                        break;
                    case 5:
                        intent.putExtra("fromPage", "night");
                        break;
                }
                mContext.startActivity(intent);
            }
        });
    }
}
