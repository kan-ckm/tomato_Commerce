#!/usr/bin/env bash
# ==============================================================================
# Script khôi phục dữ liệu mẫu vào MongoDB (Local hoặc Online)
# Cách dùng:
#   1. Khôi phục vào Local (mặc định):
#      ./restore_data.sh
#   2. Khôi phục vào MongoDB Atlas (Online):
#      ./restore_data.sh "mongodb+srv://<user>:<password>@cluster.mongodb.net/Kan-ban-hang"
# ==============================================================================

set -e

TARGET_URI="${1:-mongodb://localhost:27017/Kan-ban-hang}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/data/Kan-ban-hang"

if [ ! -d "$DATA_DIR" ]; then
    echo "Lỗi: Không tìm thấy thư mục dữ liệu tại: $DATA_DIR"
    exit 1
fi

echo "============================================================"
echo " ĐANG NẠP DỮ LIỆU MẪU VÀO MONGODB"
echo " Target URI: $TARGET_URI"
echo " Nguồn dump: $DATA_DIR"
echo "============================================================"

# Ưu tiên sử dụng Docker nếu máy chưa cài sẵn mongorestore
if command -v docker &> /dev/null; then
    echo ">> Sử dụng Docker (image mongo:8.2) để thực thi mongorestore..."
    docker run --rm \
        -v "$DATA_DIR":/dump_data \
        --network host \
        mongo:8.2 \
        mongorestore --uri="$TARGET_URI" --gzip --drop /dump_data
elif command -v mongorestore &> /dev/null; then
    echo ">> Sử dụng mongorestore trực tiếp từ hệ thống..."
    mongorestore --uri="$TARGET_URI" --gzip --drop "$DATA_DIR"
else
    echo "Lỗi: Cần cài đặt Docker hoặc mongorestore để nạp dữ liệu."
    exit 1
fi

echo "============================================================"
echo " NẠP DỮ LIỆU THÀNH CÔNG (163 documents: products, users, orders...)"
echo "============================================================"
