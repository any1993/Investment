package com.taikor.investment.adapter;

import android.app.Activity;
import android.content.Intent;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.BaseAdapter;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Product;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.find.SearchActivity;

/**
 * 基金适配器
 * Created by Any on 2017/4/12.
 */

public class SearchFundAdapter extends ListBaseAdapter<Product> {

    public SearchFundAdapter(Activity context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_fund;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        TextView id = holder.getView(R.id.tv_fund_id);
        id.setText(mDataList.get(position).getProductID());

        TextView name = holder.getView(R.id.tv_fund_name);
        name.setText(mDataList.get(position).getProductName());

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId",mDataList.get(position).getProductID());
                intent.putExtra("fromPage","fund");
                mContext.startActivity(intent);
            }
        });
    }
}
