import fs from "fs";
import { Invoice } from "./Invoice";
import { InvoiceFilter } from "./InvoiceFilter";


const file = fs.readFileSync('src/email.txt').toString();

//=================================cách 1: dùng regex===========================//
// trích xuất 1 giá trị từ chuỗi
/**
 * 
 * @param data : string (chuỗi)
 * @param pattern : RegexExpression(expression để trích xuất dữ liệu từ chuỗi)
 * @returns : trả về 1 dữ liệu cần trích xuất hoặc undefined nếu không tìm thấy
 */
function extractValueOf(data: string, pattern: RegExp): string | undefined {
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
function extractMultipleValuesOf(data: string, pattern: RegExp): string[] | undefined {
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
function extract(data: string): Invoice {
    const invoiceId = extractValueOf(data, InvoiceFilter.INVOICE_ID);
    const symbol = extractValueOf(data, InvoiceFilter.SYMBOL);
    const code = extractValueOf(data, InvoiceFilter.CODE);
    const searchCode = extractValueOf(data, InvoiceFilter.SEARCH_CODE);
    const link = extractMultipleValuesOf(data, InvoiceFilter.LINK_ATTACHED);
    const taxCode = extractValueOf(data, InvoiceFilter.TAX_CODE);

    return { invoiceId, symbol, code, searchCode, link, taxCode };
}


// const result = extract(file);
// console.log("way 1");
// console.log(result);


//=================================cách 2: đệ quy===========================//
function handleExtract(data: string, filter: string, index: number = 1): string[] {
    const store = data.indexOf(filter, index);
    if (store === -1) {
        return [];
    }

    const _escape = data.indexOf('\n', 1 + store);

    return [data.slice(store, _escape), ...handleExtract(data, filter, index + store)];
}

function extract2(data: string) {
    const invoiceId = handleExtract(data, "Số hóa đơn")
        .join("")
        .replace("Số hóa đơn: ", "")
        .replace("\r", "");

    const symbol = handleExtract(data, "Ký hiệu")
        .join("")
        .replace("Ký hiệu: ", "")
        .replace("\r", "");

    const code = handleExtract(data, "Mẫu số")
        .join("")
        .replace("Mẫu số: ", "")
        .replace("\r", "");

    const searchCode = handleExtract(data, "Mã tra cứu")
        .join("")
        .replace("Mã tra cứu: ", "")
        .replace("\r", "");

    const link = handleExtract(data, "http")
        .map(link => (link.slice(0, -3)));

    const taxCode = handleExtract(data, "Mã số thuế")
        .join("")
        .split(" ")[3];

    return { invoiceId, symbol, code, searchCode, link, taxCode };

}


const result2 = extract2(file);
console.log("way 2");
console.log(result2);