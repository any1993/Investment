package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.bean.General;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.TimeUtils;
import com.taikor.investment.utils.ToastUtils;

import java.sql.Time;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * 推送
 * Created by Any on 2017/8/18.
 */

public class PushAdapter extends RecyclerView.Adapter<PushAdapter.MyViewHolder> {

    private Context context;
    private Map<String, List<General>> map = new HashMap<>();
    private List<List<General>> list = new ArrayList<>();

    public PushAdapter(Context context){
        super();
        this.context=context;
    }

    public void setData(Map<String, List<General>> map) {
        this.map = map;

        Set<String> dates = map.keySet();
        for (String key : dates) {
            List<General> generals = map.get(key);
            list.add(generals);
        }
        notifyDataSetChanged();
    }


    public void clear() {
        map.clear();
        notifyDataSetChanged();
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View inflate = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_push, parent, false);
        return new MyViewHolder(inflate);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {

        //2017-08-16 02:13:14
        final List<General> generals = list.get(position);
        for (int i = 0; i < generals.size(); i++) {
            final General general = generals.get(i);
            String pubDate = general.getPubDate();

            holder.tvPushDay.setText(pubDate.substring(8, 10));
            holder.tvPushWeek.setText(TimeUtils.getWeek(pubDate.substring(0, 10)));

            holder.tvDinnerTitle.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent intent = new Intent(context, GeneralDescActivity.class);
                    intent.putExtra("itemId",String.valueOf(general.getPushDate()));
                    intent.putExtra("fromPage","night");
                    context.startActivity(intent);
                }
            });
            holder.tvAfternoonTitle.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent intent = new Intent(context, GeneralDescActivity.class);
                    intent.putExtra("itemId",String.valueOf(general.getPushDate()));
                    intent.putExtra("fromPage","afternoon");
                    context.startActivity(intent);
                }
            });
            holder.tvNoonTitle.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent intent = new Intent(context, GeneralDescActivity.class);
                    intent.putExtra("itemId",String.valueOf(general.getPushDate()));
                    intent.putExtra("fromPage","noon");
                    context.startActivity(intent);
                }
            });
            holder.tvBreakfastTitle.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent intent = new Intent(context, GeneralDescActivity.class);
                    intent.putExtra("itemId",String.valueOf(general.getPushDate()));
                    intent.putExtra("fromPage","morning");
                    context.startActivity(intent);
                }
            });
            switch (general.getType()) {
                case 5://晚餐
                    holder.tvDinnerTitle.setText("【晚餐】" + general.getTitle());
                    holder.tvDinnerTitle.setVisibility(View.VISIBLE);
                    holder.rlDinner.setVisibility(View.VISIBLE);
                    break;
                case 4://下午茶
                    holder.tvAfternoonTitle.setText("【下午茶】" + general.getTitle());
                    holder.tvAfternoonTitle.setVisibility(View.VISIBLE);
                    holder.rlAfternoon.setVisibility(View.VISIBLE);
                    break;
                case 3://中餐
                    holder.tvNoonTitle.setText("【中餐】" + general.getTitle());
                    holder.tvNoonTitle.setVisibility(View.VISIBLE);
                    holder.rlNoon.setVisibility(View.VISIBLE);
                    break;
                case 2://早餐
                    holder.tvBreakfastTitle.setText("【早餐】" + general.getTitle());
                    holder.tvBreakfastTitle.setVisibility(View.VISIBLE);
                    holder.rlBreakfast.setVisibility(View.VISIBLE);
                    break;
            }
        }
    }

    @Override
    public int getItemCount() {
        return map.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {

        @BindView(R.id.tv_push_day)
        TextView tvPushDay;
        @BindView(R.id.tv_push_week)
        TextView tvPushWeek;
        @BindView(R.id.ll_date)
        LinearLayout llDate;
        @BindView(R.id.rl_dinner)
        RelativeLayout rlDinner;
        @BindView(R.id.rl_noon)
        RelativeLayout rlNoon;
        @BindView(R.id.rl_afternoon)
        RelativeLayout rlAfternoon;
        @BindView(R.id.rl_breakfast)
        RelativeLayout rlBreakfast;
        @BindView(R.id.tv_dinner_title)
        TextView tvDinnerTitle;
        @BindView(R.id.tv_noon_title)
        TextView tvNoonTitle;
        @BindView(R.id.tv_afternoon_title)
        TextView tvAfternoonTitle;
        @BindView(R.id.tv_breakfast_title)
        TextView tvBreakfastTitle;

        private MyViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
        }

    }
}
