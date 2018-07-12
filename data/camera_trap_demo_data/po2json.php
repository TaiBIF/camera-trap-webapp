<?php

error_reporting(0);

$po_arr = json_decode(file_get_contents("camera_trap_local_data.txt"));

$data = [];
foreach ($po_arr as $po_string) {

  preg_match('/C:7:"MongoId":[0-9]{2}:\{([0-9a-fA-F]+?)\}/', $po_arr[0], $match);

  $id = $match[1];

  $po = unserialize($po_string);
  $po['_id'] = $id;

  $data[] = $po;
}

echo json_encode($data, JSON_PRETTY_PRINT) . "\n";

