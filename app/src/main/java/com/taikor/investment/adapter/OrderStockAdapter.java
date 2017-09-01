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
import com.taikor.investment.bean.OrderStock;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

/**
 * 下单排行
 * Created by Any on 2017/8/17.
 */

public class OrderStockAdapter extends ListBaseAdapter<OrderStock> {

    public OrderStockAdapter(Context context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_order_stock;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        OrderStock.StockBean stock = mDataList.get(position).getStock();

        TextView name = holder.getView(R.id.order_name);
        name.setText(stock.getName());

        TextView code = holder.getView(R.id.order_code);
        code.setText(stock.getCode());

        TextView buy = holder.getView(R.id.order_buy);
        buy.setText(String.valueOf(mDataList.get(position).getBuyCount()));

        TextView sell = holder.getView(R.id.order_sell);
        sell.setText(String.valueOf(mDataList.get(position).getSellCount()));

        TextView price = holder.getView(R.id.order_price);
        price.setText(CommonUtils.setDoubleTwo(stock.getTrade()));

        TextView rate = holder.getView(R.id.order_rate);
        double changePercent = stock.getChangepercent();
        if (changePercent > 0) {
            rate.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            rate.setText("+" + CommonUtils.setDoubleTwo(changePercent) + "%");
        } else if (changePercent < 0) {
            rate.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            rate.setText("-" + CommonUtils.setDoubleTwo(changePercent) + "%");
        }

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId", mDataList.get(position).getStock().getSymbol());
                intent.putExtra("fromPage","stock");
                mContext.startActivity(intent);
            }
        });
    }
}
