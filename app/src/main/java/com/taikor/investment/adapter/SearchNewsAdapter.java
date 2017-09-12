package com.taikor.investment.adapter;

import android.content.Context;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.HotNews;

/**
 * 搜索个股
 * Created by Any on 2017/9/5.
 */

public class SearchNewsAdapter extends ListBaseAdapter<HotNews.ItemListBean> {

    public SearchNewsAdapter(Context context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_search_news;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        TextView title = holder.getView(R.id.tv_news_title);
        title.setText(mDataList.get(position).getCleanTitle());

        TextView summary = holder.getView(R.id.tv_news_summary);
        summary.setText(mDataList.get(position).getSummary());
    }
}
