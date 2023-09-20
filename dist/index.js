"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const InvoiceFilter_1 = require("./InvoiceFilter");
const file = fs_1.default.readFileSync('src/email.txt').toString();
//=================================cách 1: dùng regex===========================//
// trích xuất 1 giá trị từ chuỗi
/**
 *
 * @param data : string (chuỗi)
 * @param pattern : RegexExpression(expression để trích xuất dữ liệu từ chuỗi)
 * @returns : trả về 1 dữ liệu cần trích xuất hoặc undefined nếu không tìm thấy
 */
function extractValueOf(data, pattern) {
    // tìm dữ liệu match với pattern
    const match = data.match(pattern);
    // nếu không match trả về undefined
    if (!match) {
        return undefined;
    }
    // trả về dữ liệu cần trích xuất nếu match
    // lưu ý: 
    // match[0] trả về toàn bộ dữ liệu kể cả giá trị filter (vd: Invoice Id: 123)
    // match[1] trả về đúng dữ liệu cần trích xuất (vd: 123)
    return match[1];
}
// trích xuất nhiều giá trị từ chuỗi
/**
 *
 * @param data : string (chuỗi)
 * @param pattern : RegexExpression(expression để trích xuất dữ liệu từ chuỗi)
 * @returns : trả về 1 hoặc nhiều dữ liệu cần trích xuất hoặc undefined nếu không tìm thấy
 */
function extractMultipleValuesOf(data, pattern) {
    // tìm tất cả dữ liệu match với pattern
    const matches = [...data.matchAll(pattern)];
    // nếu không tìm thấy return undefined
    if (matches.length === 0) {
        return undefined;
    }
    // trả về toàn bộ giá trị match được
    const results = matches.map(match => (match[0]));
    return results;
}
// hàm extract 1 đoạn văn và trả về các dữ liệu cần trích xuất
function extract(data) {
    const invoiceId = extractValueOf(data, InvoiceFilter_1.InvoiceFilter.INVOICE_ID);
    const symbol = extractValueOf(data, InvoiceFilter_1.InvoiceFilter.SYMBOL);
    const code = extractValueOf(data, InvoiceFilter_1.InvoiceFilter.CODE);
    const searchCode = extractValueOf(data, InvoiceFilter_1.InvoiceFilter.SEARCH_CODE);
    const link = extractMultipleValuesOf(data, InvoiceFilter_1.InvoiceFilter.LINK_ATTACHED);
    const taxCode = extractValueOf(data, InvoiceFilter_1.InvoiceFilter.TAX_CODE);
    return { invoiceId, symbol, code, searchCode, link, taxCode };
}
const result1 = extract(file);
console.log("=================================way 1=================================");
console.log(result1);
//=================================cách 2: đệ quy===========================//
/**
 *
 * @param data : chuỗi cần filter
 * @param filter : chuỗi filter
 * @param index : giá trị mặc định dùng để filter từ giá trị tìm được đến giá trị tiếp theo (vd: tìm được 6, tìm tiếp theo là 6+1)
 * @returns : trả về mảng các đoạn (lấy cả đoạn tồn tại chuỗi filter) được trích xuất từ data
 */
function handleExtract(data, filter, index = 1) {
    // lấy index của chuỗi filter trong data
    const flag = data.indexOf(filter, index);
    // nếu không tìm thấy trả về mảng rổng
    if (flag === -1) {
        return [];
    }
    // lấy vị trí xuống dòng gần nhất
    const _escape = data.indexOf('\n', 1 + flag);
    // gọi đệ quy để tiếp tục query các đoạn sau trong chuỗi ban đầu
    return [data.slice(flag, _escape), ...handleExtract(data, filter, 1 + flag)];
}
// tinh gọi chuỗi mã hóa đơn
function extractInvoiceId(data, filter) {
    let result = undefined;
    const _object = {
        handle() {
            const extract = handleExtract(data, filter);
            if (extract.length === 0) {
                return this;
            }
            result = extract.join("")
                .replace("Số hóa đơn: ", "")
                .replace("\r", "");
            return this;
        },
        result() {
            return result;
        }
    };
    return _object;
}
// tinh gọi chuỗi ký hiệu
function extractInvoiceSymbol(data, filter) {
    let result = undefined;
    const _object = {
        handle() {
            const extract = handleExtract(data, filter);
            if (extract.length === 0) {
                return this;
            }
            result = extract.join("")
                .replace("Ký hiệu: ", "")
                .replace("\r", "");
            return this;
        },
        result() {
            return result;
        }
    };
    return _object;
}
// tinh gọn chuỗi mẫu số
function extractInvoiceCode(data, filter) {
    let result = undefined;
    const _object = {
        handle() {
            const extract = handleExtract(data, filter);
            if (extract.length === 0) {
                return this;
            }
            result = extract.join("")
                .replace("Mẫu số: ", "")
                .replace("\r", "");
            return this;
        },
        result() {
            return result;
        }
    };
    return _object;
}
// tinh gọn chuỗi mã tra cứu
function extractInvoiceSearchCode(data, filter) {
    let result = undefined;
    const _object = {
        handle() {
            const extract = handleExtract(data, filter);
            if (extract.length === 0) {
                return this;
            }
            result = extract.join("")
                .replace("Mã tra cứu: ", "")
                .replace("\r", "");
            return this;
        },
        result() {
            return result;
        }
    };
    return _object;
}
// tinh gọn các link tìm được
function extractInvoiceLink(data, filter) {
    let result = undefined;
    const _object = {
        handle() {
            const extract = handleExtract(data, filter);
            if (extract.length === 0) {
                return this;
            }
            result = extract.map(link => (link.slice(0, -3)));
            return this;
        },
        result() {
            return result;
        }
    };
    return _object;
}
// tinh gọn mã thuế
function extractInvoiceTaxCode(data, filter) {
    let result = undefined;
    const _object = {
        handle() {
            const extract = handleExtract(data, filter);
            if (extract.length === 0) {
                return this;
            }
            result = extract.join("")
                .split(" ")[3];
            return this;
        },
        result() {
            return result;
        }
    };
    return _object;
}
// hàm extract các thông tin từ file
function extract2(data) {
    const invoiceId = extractInvoiceId(data, "Số hóa đơn")
        .handle()
        .result();
    const symbol = extractInvoiceSymbol(data, "Ký hiệu")
        .handle()
        .result();
    const code = extractInvoiceCode(data, "Mẫu số")
        .handle()
        .result();
    const searchCode = extractInvoiceSearchCode(data, "Mã tra cứu")
        .handle()
        .result();
    const link = extractInvoiceLink(data, "http")
        .handle()
        .result();
    const taxCode = extractInvoiceTaxCode(data, "Mã số thuế")
        .handle()
        .result();
    return { invoiceId, symbol, code, searchCode, link, taxCode };
}
const result2 = extract2(file);
console.log("=================================way 2=================================");
console.log(result2);
