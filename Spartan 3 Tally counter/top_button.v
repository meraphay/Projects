module top_button(btn_in, clk, rst_p, p_out);
//This is the wrapper or top module for push button it includes synchronizer debouncer and level 2 pulse convertor

input btn_in, clk, rst_p;
output p_out;

wire b_w, db_w;
 
synchronizer Sync1(.async_in(btn_in), .clk(clk), .rst_p(rst_p), .sync_out(b_w));

top_debounce Debounce1(.bounce_in(b_w), .clk(clk), .rst_p(rst_p), .debounce_out(db_w));

lev_puls_conv L2P_1(.clk(clk), .rst_p(rst_p), .level_in(db_w), .pulse_out(p_out));
endmodule