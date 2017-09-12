package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

/**
 * 股票
 * Created by Any on 2017/7/28.
 */

public class StockAdapter extends ListBaseAdapter<Stock> {

    private Context mContext;

    public StockAdapter(Context context) {
        super(context);
        mContext = context;
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_stock;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        //名称
        TextView name = holder.getView(R.id.tv_stock_name);
        name.setText(mDataList.get(position).getName());
        //代码
        TextView code = holder.getView(R.id.tv_stock_code);
        code.setText(mDataList.get(position).getCode());
        //价格变动
        TextView price = holder.getView(R.id.tv_stock_price);
        double trade = mDataList.get(position).getTrade();
        //涨幅
        TextView percent = holder.getView(R.id.tv_stock_percent);
        double changePercent = mDataList.get(position).getChangepercent();

        if (changePercent > 0) {
            percent.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            price.setTextColor(ContextCompat.getColor(mContext, R.color.up));
        } else if(changePercent<0){
            percent.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            price.setTextColor(ContextCompat.getColor(mContext, R.color.down));
        }
        percent.setText(CommonUtils.setDoubleTwo(changePercent) + "%");
        price.setText(CommonUtils.setDoubleTwo(trade));

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId", mDataList.get(position).getSymbol());
                intent.putExtra("fromPage","stock");
                mContext.startActivity(intent);
            }
        });
    }
}
