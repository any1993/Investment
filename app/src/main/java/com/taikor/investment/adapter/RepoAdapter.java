package com.taikor.investment.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.bean.Product;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * 智能投顾，自定义，添加产品，设置仓位，列表适配器
 * Created by Any on 2017/4/14.
 */

public class RepoAdapter extends BaseAdapter {

    private Context context;
    private ArrayList<Product> list;
    private List<String> proportionList;
    private MyListener listener ;

    public RepoAdapter(Context context) {
        this.context = context;
        listener = (MyListener) context;
    }

    public void setData(ArrayList<Product> list,
                        List<String> proportionList) {
        this.list = list;
        this.proportionList=proportionList;
        notifyDataSetChanged();
    }
    
    public interface MyListener {
        void delete(int position);

        void setRepo(int position);
    }

    public class ViewHolder {
        @BindView(R.id.tv_product_name)
        TextView tvProductName;
        @BindView(R.id.iv_delete_product)
        ImageView ivDeleteProduct;
        @BindView(R.id.tv_repo)
        public TextView tvRepo;

        ViewHolder(View view) {
            ButterKnife.bind(this, view);
        }
    }
    

    @Override
    public int getCount() {
        return list.size();
    }

    @Override
    public Object getItem(int position) {
        return list.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        final ViewHolder holder;
        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.item_repo, null);
            holder = new ViewHolder(convertView);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }
        //如果不为空，表示第二次跳转，有数据
        if(proportionList==null){
            holder.tvRepo.setText("0");
        }else{
            for(int i=0;i<proportionList.size();i++){
                if (i==position){
                    holder.tvRepo.setText(proportionList.get(i));
                    break;
                }
            }
        }
        holder.tvProductName.setText(list.get(position).getProductName());//设置产品名称
        holder.ivDeleteProduct.setImageResource(R.drawable.delete);//删除图标
        //点击删除条目
        holder.ivDeleteProduct.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                listener.delete(position);//回调
            }
        });

        holder.tvRepo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                listener.setRepo(position);
            }
        });
        return convertView;
    }
    
}

