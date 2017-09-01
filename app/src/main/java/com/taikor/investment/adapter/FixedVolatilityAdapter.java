package com.taikor.investment.adapter;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Product;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

/**
 * 固定资产和净值波动 列表的适配器
 * <p>
 * Created by Any on 2017/4/6.
 */

public class FixedVolatilityAdapter extends ListBaseAdapter<Product> {


    public FixedVolatilityAdapter(Activity context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_fixed_volatility;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        TextView id = holder.getView(R.id.tv_all_id);
        id.setText(String.valueOf(position + 1));
        TextView name = holder.getView(R.id.tv_all_name);
        name.setText(mDataList.get(position).getProductName());
        TextView perFit = holder.getView(R.id.tv_all_per_fit);
        perFit.setText(CommonUtils.setDoubleFour(mDataList.get(position).getUnitNet()));
        TextView income = holder.getView(R.id.tv_all_income);
        double annualizedProfitRate = mDataList.get(position).getAnnualizedProfitRate();
        if (annualizedProfitRate > 0) {
            income.setTextColor(Color.parseColor("#FD3642"));
        } else if (annualizedProfitRate < 0) {
            income.setTextColor(Color.parseColor("#07B60E"));
        } else
            income.setTextColor(Color.parseColor("#333333"));
        income.setText(CommonUtils.setDoubleTwo(annualizedProfitRate));

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId",mDataList.get(position).getProductID());
                intent.putExtra("fromPage", "fund");
                mContext.startActivity(intent);
            }
        });

    }
}
