package com.taikor.investment.base;

import android.app.Activity;
import android.util.SparseArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.LinkedList;
import java.util.List;

public abstract class BaseAdapter<T> extends android.widget.BaseAdapter {
    private List<T> mData = new LinkedList<>();
    private LayoutInflater mInflater;

    public BaseAdapter(Activity context) {
        mInflater = LayoutInflater.from(context);
    }

    @Override
    final public int getCount() {
        return mData.size();
    }

    @Override
    final public T getItem(int position) {
        return mData.get(position);
    }

    /** 设置数据 */
    final public void setData(List<T> data, boolean reset) {
        if (reset) {
            mData.clear();
        }
        if (data != null) {
            mData.addAll(data);
        }
        notifyDataSetChanged();
    }

    @Override
    final public long getItemId(int position) {
        return position;
    }

    @Override
    final public View getView(int position, View convertView, ViewGroup parent) {
        int itemViewType = getItemViewType(position);
        T item = getItem(position);
        ViewHolder holder;
        boolean reused = false;
        if (convertView == null) {
            int itemLayoutId = getItemLayoutId(itemViewType);
            convertView = mInflater.inflate(itemLayoutId, null);
            holder = new ViewHolder(convertView);
            convertView.setTag(holder);
        } else {
            reused = true;
            holder = (ViewHolder) convertView.getTag();
        }
        handleItem(itemViewType, position, item, holder, reused);
        return convertView;
    }

    /**
     * 返回视图类型
     * @param itemViewType 视图类型
     * @return 布局id
     */
    protected abstract int getItemLayoutId(int itemViewType);

    /**
     * 处理item，主要是填充数据
     * @param itemViewType item对应的视图类型
     * @param position 实体对应的索引位置
     * @param item 具体实体
     * @param holder holder
     */
    protected abstract void handleItem(int itemViewType, int position, T item, ViewHolder holder, boolean reused);

    protected static class ViewHolder {
        private View mItemLayout;
        SparseArray<View> mViews = new SparseArray<>();

        public ViewHolder(View itemLayout) {
            mItemLayout = itemLayout;
        }

        public View gettemLayout() {
            return mItemLayout;
        }

        public <T extends View> T get(int viewId) {
            View childView = mViews.get(viewId);
            if (childView == null) {
                childView = mItemLayout.findViewById(viewId);
                mViews.put(viewId, childView);
            }
            return (T) childView;
        }

        public <T extends View> T get(int viewId, Class<T> viewClass) {
            View childView = mViews.get(viewId);
            if (childView == null) {
                childView = mItemLayout.findViewById(viewId);
                mViews.put(viewId, childView);
            }
            return (T) childView;
        }
    }

}
