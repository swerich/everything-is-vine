from django.http import JsonResponse
from common.json import ModelEncoder
from django.views.decorators.http import require_http_methods
from sales_rest.models import WineVO, Order, ShoppingItem
import json


class WineVOEncoder(ModelEncoder):
    model = WineVO
    properties = [
        "id",
        "winery_id",
        "brand",
        "year",
        "varietal",
        "description",
        "region",
        "abv",
        "volume",
        "city_state",
        "price",
        "picture_url",
        "quantity",
        "import_href",
    ]


class OrderEncoder(ModelEncoder):
    model = Order
    properties = [
        "id",
        "confirmation_number",
        "created",
        "first_name",
        "last_name",
        "address_one",
        "address_two",
        "city",
        "state",
        "zip_code",
        "country",
        "card_name",
        "last_four",
        "exp_date",
        "discount_ten",
        "account_email",
    ]


class ShoppingItemEncoder(ModelEncoder):
    model = ShoppingItem
    properties = [
        "order_id",
        "item",
        "price",
        "quantity",
    ]

    def get_extra_data(self, o):
        return {
            "order_id": o.order_id.id,
            "item": {"id": o.item.id, "winery_id": o.item.winery_id},
        }


@require_http_methods(["GET"])
def api_list_wines(request, pk1):
    if request.method == "GET":
        wines = WineVO.objects.filter(winery_id=pk1)
        if len(wines) > 0:
            return JsonResponse(
                {"wines": wines},
                encoder=WineVOEncoder,
            )
        else:
            return JsonResponse(
                {"message": "Winery does not exist or has no list of wines"}
            )


@require_http_methods(["GET"])
def api_show_wine(request, pk1, pk2):
    if request.method == "GET":
        try:
            wine = WineVO.objects.filter(winery_id=pk1).get(id=pk2)
            return JsonResponse(
                wine,
                encoder=WineVOEncoder,
                safe=False,
            )
        except WineVO.DoesNotExist:
            return JsonResponse(
                {"message": "Wine does not exist for this winery"},
                status=404,
            )
    else:
        return JsonResponse(
            {"message": "ERROR"},
            status=400,
        )


@require_http_methods(["GET", "POST"])
def api_list_orders(request):
    if request.method == "GET":
        orders = Order.objects.all()
        return JsonResponse(
            {"orders": orders},
            encoder=OrderEncoder,
        )
    else:
        content = json.loads(request.body)
        print("***content", content)
        order = Order.objects.create(**content)
        return JsonResponse({"order": order.id})


@require_http_methods(["GET"])
def api_show_order(request, pk):
    if request.method == "GET":
        try:
            order = Order.objects.get(id=pk)
            return JsonResponse(
                order,
                encoder=OrderEncoder,
                safe=False,
            )
        except Order.DoesNotExist:
            return JsonResponse(
                {"message": "Order does not exist"},
                status=404,
            )
    else:
        return JsonResponse(
            {"message": "ERROR"},
            status=400,
        )


@require_http_methods(["GET", "POST"])
def api_list_shopping_items(request, pk1):
    if request.method == "GET":
        shopping_items = ShoppingItem.objects.filter(item__winery_id=pk1).all()
        return JsonResponse(
            {"shopping_items": shopping_items},
            encoder=ShoppingItemEncoder,
        )
    else:
        content = json.loads(request.body)
        shopping_cart_items = content["shopping_items"]
        for index in range(len(shopping_cart_items)):
            order_id = shopping_cart_items[int(index)]["order_id"]
            order = Order.objects.get(id=order_id)
            shopping_cart_items[int(index)]["order_id"] = order
            winery = shopping_cart_items[int(index)]["item"]["winery_id"]
            wine = shopping_cart_items[int(index)]["item"]["id"]
            wine_id = WineVO.objects.filter(winery_id=winery).get(id=wine)
            shopping_cart_items[int(index)]["item"] = wine_id
            shopping_items = ShoppingItem.objects.create(
                **shopping_cart_items[int(index)]
            )
        return JsonResponse(
            shopping_items,
            encoder=ShoppingItemEncoder,
            safe=False,
        )


@require_http_methods(["GET", "POST"])
def api_list_shopping_items_order(request, pk1, pk2):
    if request.method == "GET":
        shopping_items = ShoppingItem.objects.filter(
            item__winery_id=pk1,
            order_id=pk2)
        return JsonResponse(
            {"shopping_items": shopping_items},
            encoder=ShoppingItemEncoder,
        )
