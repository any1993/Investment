package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Block;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

/**
 * 主题
 * Created by Any on 2017/7/28.
 */

public class ThemeAdapter extends ListBaseAdapter<Block> {

    private Context mContext;

    public ThemeAdapter(Context context) {
        super(context);
        mContext = context;
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_theme;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        //名称
        TextView name = holder.getView(R.id.tv_theme_name);
        name.setText(mDataList.get(position).getName());
        //价格变动
        TextView price = holder.getView(R.id.tv_theme_price);
        //涨幅
        TextView percent = holder.getView(R.id.tv_theme_percent);
        double settlement = mDataList.get(position).getSettlement();
        double changePercent = mDataList.get(position).getChangePercent();

        if (changePercent > 0) {
            percent.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            percent.setText(CommonUtils.setDoubleTwo(changePercent) + "%");

            price.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            price.setText(CommonUtils.setDoubleTwo(settlement));
        } else if (changePercent < 0) {
            percent.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            percent.setText(CommonUtils.setDoubleTwo(changePercent) + "%");

            price.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            price.setText(CommonUtils.setDoubleTwo(settlement));
        } else {
            percent.setText("0.00%");
        }

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId", mDataList.get(position).getID());
                intent.putExtra("fromPage", "theme");
                mContext.startActivity(intent);
            }
        });
    }
}
