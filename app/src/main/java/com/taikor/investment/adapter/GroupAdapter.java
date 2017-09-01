package com.taikor.investment.adapter;

import android.content.Context;
import android.support.v4.content.ContextCompat;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Group;
import com.taikor.investment.utils.CommonUtils;

/**
 * 主题
 * Created by Any on 2017/7/28.
 */

public class GroupAdapter extends ListBaseAdapter<Group> {

    private Context mContext;

    public GroupAdapter(Context context) {
        super(context);
        mContext = context;
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_group;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, int position) {
        //名称
        TextView name = holder.getView(R.id.tv_group_name);
        name.setText(mDataList.get(position).getPortfolioName());

        //净值
        TextView worth = holder.getView(R.id.tv_group_worth);
        double netWorth = mDataList.get(position).getNetWorth();
        worth.setText(CommonUtils.setDoubleFour(netWorth));
        //收益率
        TextView income = holder.getView(R.id.tv_group_rate);
        double rate = mDataList.get(position).getAnnualizedProfit();
        if (rate > 0) {
            income.setTextColor(ContextCompat.getColor(mContext, R.color.up));
        } else if(rate<0){
            income.setTextColor(ContextCompat.getColor(mContext, R.color.down));
        }
        income.setText(CommonUtils.setDoubleTwo(rate) + "%");
    }
}
