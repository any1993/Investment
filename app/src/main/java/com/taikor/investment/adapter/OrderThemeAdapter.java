package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Order;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

/**
 * 下单排行
 * Created by Any on 2017/8/17.
 */

public class OrderThemeAdapter extends ListBaseAdapter<Order>{

    public OrderThemeAdapter(Context context){
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_order_theme;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        Order.BlockBean block = mDataList.get(position).getBlock();

        TextView name = holder.getView(R.id.tv_order_name);
        name.setText(block.getName());

        TextView buy = holder.getView(R.id.tv_order_buy);
        buy.setText(String.valueOf(mDataList.get(position).getBuyCount()));

        TextView sell = holder.getView(R.id.tv_order_sell);
        sell.setText(String.valueOf(mDataList.get(position).getSellCount()));

        TextView price = holder.getView(R.id.tv_order_price);
        String avgPrice = block.getAvgPrice();
        if(avgPrice.equals("NaN")){
            price.setText("");
        }else{
            price.setText(CommonUtils.setDoubleTwo( Double.valueOf(avgPrice)));
        }

        TextView rate = holder.getView(R.id.tv_order_rate);
        double changePercent = block.getChangePercent();
        if (changePercent > 0) {
            rate.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            rate.setText("+"+CommonUtils.setDoubleTwo(changePercent) + "%");
        } else if(changePercent<0){
            rate.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            rate.setText("-"+CommonUtils.setDoubleTwo(changePercent) + "%");
        }else{
            rate.setText("0.00%");
        }

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId", mDataList.get(position).getBlock().getID());
                intent.putExtra("fromPage","theme");
                mContext.startActivity(intent);
            }
        });
    }
}
